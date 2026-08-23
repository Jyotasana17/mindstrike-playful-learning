import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { GameShell } from "@/components/Layout";
import { JellyButton, LevelPath, FloatingScore, Countdown, StatChip } from "@/components/bits";
import { usePlayer, isPrime, isComposite } from "@/lib/store";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/arcade/target-strike")({
  validateSearch: z.object({ level: z.coerce.number().optional() }),
  head: () => ({
    meta: [{ title: "Target Strike" }],
  }),
  component: TargetStrike,
});

type TargetItem = {
  id: number;
  value: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isTarget: boolean;
  active: boolean;
};

const CATEGORIES = {
  prime: { label: "Prime Numbers", check: (v: string) => isPrime(parseInt(v)), gen: () => Math.floor(Math.random() * 50) + 2 },
  composite: { label: "Composite Numbers", check: (v: string) => isComposite(parseInt(v)), gen: () => Math.floor(Math.random() * 50) + 4 },
  even: { label: "Even Numbers", check: (v: string) => parseInt(v) % 2 === 0, gen: () => Math.floor(Math.random() * 100) },
  odd: { label: "Odd Numbers", check: (v: string) => parseInt(v) % 2 !== 0, gen: () => Math.floor(Math.random() * 100) },
  s_block: { label: "S-Block Elements", check: (v: string) => ["H", "Li", "Na", "K", "Be", "Mg", "Ca"].includes(v), gen: () => ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca"][Math.floor(Math.random() * 20)] },
};

const LEVELS = [
  { id: 1, category: "even", speed: 1, duration: 30, spawnRate: 800 },
  { id: 2, category: "odd", speed: 1.2, duration: 30, spawnRate: 700 },
  { id: 3, category: "prime", speed: 1.5, duration: 35, spawnRate: 600 },
  { id: 4, category: "composite", speed: 1.8, duration: 35, spawnRate: 500 },
  { id: 5, category: "s_block", speed: 2.2, duration: 40, spawnRate: 400 },
] as const;

function TargetStrike() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { player, finishSession, recordTopic } = usePlayer();
  const [level, setLevel] = useState(search.level ?? 1);
  const [playing, setPlaying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);
  const [wrongHits, setWrongHits] = useState(0);
  
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [floating, setFloating] = useState<{ id: number; x: number; y: number; text: string; good: boolean }[]>([]);

  const reqRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const spawnTimerRef = useRef<number>(0);
  
  const config = LEVELS[level - 1];
  const cat = CATEGORIES[config.category as keyof typeof CATEGORIES];
  
  useEffect(() => {
    if (search.level && search.level !== level) {
      setLevel(search.level);
    }
  }, [search.level]);

  const stateRef = useRef({ targets, playing, timeLeft, score, combo, bestCombo, correctHits, wrongHits });
  useEffect(() => {
    stateRef.current = { targets, playing, timeLeft, score, combo, bestCombo, correctHits, wrongHits };
  }, [targets, playing, timeLeft, score, combo, bestCombo, correctHits, wrongHits]);

  const startGame = () => {
    setTargets([]);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setCorrectHits(0);
    setWrongHits(0);
    setTimeLeft(config.duration);
    setFloating([]);
    
    setCountdown(3);
    let c = 3;
    const iv = setInterval(() => {
      c--;
      if (c > 0) setCountdown(c);
      else if (c === 0) setCountdown("GO!" as any);
      else {
        clearInterval(iv);
        setCountdown(null);
        setPlaying(true);
      }
    }, 800);
  };

  const addScore = (pts: number, x: number, y: number, good: boolean) => {
    setScore(s => Math.max(0, s + pts));
    if (good) {
      setCombo(c => {
        const nc = c + 1;
        setBestCombo(bc => Math.max(bc, nc));
        return nc;
      });
      setCorrectHits(h => h + 1);
    } else {
      setCombo(0);
      setWrongHits(h => h + 1);
    }
    
    const id = Date.now();
    setFloating(f => [...f, { id, x, y, text: pts > 0 ? `+${pts}` : `${pts}`, good }]);
    setTimeout(() => setFloating(f => f.filter(i => i.id !== id)), 800);
  };

  const handleShoot = (t: TargetItem) => {
    if (!playing || !t.active) return;
    
    setTargets(cur => cur.map(i => i.id === t.id ? { ...i, active: false } : i));
    
    if (t.isTarget) {
      sfx.play();
      addScore(15 + combo * 3, t.x, t.y, true);
      recordTopic(config.category as any, true, 800);
    } else {
      sfx.oops();
      addScore(-10, t.x, t.y, false);
      recordTopic(config.category as any, false, 800);
    }
  };

  useEffect(() => {
    if (!playing) return;
    
    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      const st = stateRef.current;
      let nextTargets = st.targets.map(t => {
        let nx = t.x + t.vx * dt * 0.05 * config.speed;
        let ny = t.y + t.vy * dt * 0.05 * config.speed;
        
        let nvx = t.vx;
        let nvy = t.vy;
        if (nx < 5 || nx > 95) { nvx *= -1; nx = nx < 5 ? 5 : 95; }
        if (ny < 15 || ny > 90) { nvy *= -1; ny = ny < 15 ? 15 : 90; }
        
        return { ...t, x: nx, y: ny, vx: nvx, vy: nvy };
      }).filter(t => t.active);
      
      spawnTimerRef.current += dt;
      if (spawnTimerRef.current > config.spawnRate) {
        spawnTimerRef.current = 0;
        
        const forceTarget = Math.random() > 0.6;
        let val = "";
        do {
          val = cat.gen().toString();
        } while (forceTarget ? !cat.check(val) : cat.check(val));
        
        nextTargets.push({
          id: Date.now(),
          value: val,
          x: Math.random() > 0.5 ? 5 : 95,
          y: 20 + Math.random() * 60,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          isTarget: cat.check(val),
          active: true
        });
      }
      
      setTargets(nextTargets);
      reqRef.current = requestAnimationFrame(loop);
    };
    
    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [playing, config, cat]);

  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPlaying(false);
          const { score: finalScore, bestCombo, correctHits, wrongHits } = stateRef.current;
          
          const stars = finalScore > 200 ? 3 : finalScore > 100 ? 2 : finalScore > 40 ? 1 : 0;
          const xp = finalScore > 0 ? Math.floor(finalScore / 3) : 0;
          
          const totalHits = correctHits + wrongHits;
          const accuracy = totalHits > 0 ? Math.round((correctHits / totalHits) * 100) : 0;
          
          finishSession({ game: "target-strike", level, stars, xp });
          
          navigate({
            to: "/arcade/result",
            search: {
              game: "target-strike",
              level: level,
              score: finalScore,
              stars: stars,
              xp: xp,
              accuracy: accuracy,
              combo: bestCombo,
              time: config.duration,
              details: JSON.stringify({
                "Correct Targets": correctHits,
                "Wrong Targets": wrongHits
              })
            }
          });
          
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [playing, level, finishSession, navigate, config.duration]);

  return (
    <GameShell wide title="☄️ Target Strike">
      <div className="mb-4">
        <LevelPath 
          levels={5} 
          progress={player.mini["target-strike"]} 
          current={level} 
          onPick={l => { setLevel(l); setPlaying(false); }} 
        />
      </div>

      <div className="toy-card relative h-[60vh] min-h-[400px] overflow-hidden bg-gradient-to-b from-sky to-mint/30 touch-none">
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <StatChip icon="🎯" value={cat.label} className={playing ? "ring-2 ring-primary bg-primary/10" : ""} />
          <div className="flex gap-2">
            <StatChip icon="🔥" value={`${combo}x`} className={combo > 3 ? "animate-pulse-glow" : ""} />
            <StatChip icon="⏱️" value={`${timeLeft}s`} />
            <StatChip icon="✨" value={score} />
          </div>
        </div>

        {!playing && !countdown && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/10 backdrop-blur-[2px]">
            <JellyButton variant="primary" size="lg" onClick={startGame}>
              ▶️ Start Level {level}
            </JellyButton>
          </div>
        )}

        {countdown !== null && <Countdown value={countdown} />}
        <FloatingScore items={floating} />

        {targets.map(t => (
          <button
            key={t.id}
            onPointerDown={() => handleShoot(t)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-card border-4 border-muted text-foreground font-display text-xl drop-shadow-md transition-transform active:scale-75"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            {t.value}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
