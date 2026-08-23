import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { GameShell } from "@/components/Layout";
import { JellyButton, LevelPath, FloatingScore, Countdown, StatChip } from "@/components/bits";
import { usePlayer } from "@/lib/store";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/arcade/shape-hunter")({
  validateSearch: z.object({ level: z.coerce.number().optional() }),
  head: () => ({
    meta: [{ title: "Shape Hunter" }],
  }),
  component: ShapeHunter,
});

type Shape = {
  id: number;
  type: "triangle" | "circle" | "square" | "star";
  x: number;
  y: number;
  speed: number;
  clicked: boolean;
};

const SHAPES = {
  triangle: "🔺",
  circle: "🟢",
  square: "🟦",
  star: "⭐",
};

const LEVELS = [
  { id: 1, target: "triangle", speed: 0.3, duration: 30, types: ["triangle", "circle"] as const, total: 20 },
  { id: 2, target: "circle", speed: 0.5, duration: 30, types: ["triangle", "circle", "square"] as const, total: 30 },
  { id: 3, target: "square", speed: 0.7, duration: 30, types: ["triangle", "circle", "square"] as const, total: 40 },
  { id: 4, target: "star", speed: 0.9, duration: 30, types: ["triangle", "circle", "square", "star"] as const, total: 50 },
  { id: 5, target: "triangle", speed: 1.2, duration: 25, types: ["triangle", "circle", "square", "star"] as const, total: 60 },
];

function ShapeHunter() {
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
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [floating, setFloating] = useState<{ id: number; x: number; y: number; text: string; good: boolean }[]>([]);

  const reqRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const spawnTimerRef = useRef<number>(0);
  const stateRef = useRef({ shapes, playing, timeLeft, score, combo, bestCombo, correctHits, wrongHits });

  useEffect(() => {
    stateRef.current = { shapes, playing, timeLeft, score, combo, bestCombo, correctHits, wrongHits };
  }, [shapes, playing, timeLeft, score, combo, bestCombo, correctHits, wrongHits]);

  // If search param changes, update level
  useEffect(() => {
    if (search.level && search.level !== level) {
      setLevel(search.level);
    }
  }, [search.level]);

  const config = LEVELS[level - 1];

  const startGame = () => {
    setShapes([]);
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

  const handleTap = (s: Shape) => {
    if (!playing || s.clicked) return;
    
    setShapes(cur => cur.map(i => i.id === s.id ? { ...i, clicked: true } : i));
    
    const isTarget = s.type === config.target;
    if (isTarget) {
      sfx.play();
      addScore(10 + combo * 2, s.x, s.y, true);
      recordTopic("shapes", true, 500); 
    } else {
      sfx.oops();
      addScore(-5, s.x, s.y, false);
      recordTopic("shapes", false, 500);
    }
  };

  useEffect(() => {
    if (!playing) return;
    
    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      const { shapes: currentShapes } = stateRef.current;
      
      let nextShapes = currentShapes.map(s => ({ ...s, y: s.y + s.speed * dt * 0.1 }))
        .filter(s => s.y < 110 && !s.clicked);
        
      spawnTimerRef.current += dt;
      if (spawnTimerRef.current > 800 / config.speed) {
        spawnTimerRef.current = 0;
        nextShapes.push({
          id: Date.now(),
          type: config.types[Math.floor(Math.random() * config.types.length)],
          x: 10 + Math.random() * 80,
          y: -10,
          speed: config.speed * (0.8 + Math.random() * 0.4),
          clicked: false
        });
      }
      
      setShapes(nextShapes);
      
      reqRef.current = requestAnimationFrame(loop);
    };
    
    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [playing, config]);

  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPlaying(false);
          const { score: finalScore, bestCombo, correctHits, wrongHits } = stateRef.current;
          
          // Calculate stars
          const stars = finalScore > 150 ? 3 : finalScore > 80 ? 2 : finalScore > 30 ? 1 : 0;
          const xp = finalScore > 0 ? Math.floor(finalScore / 2) : 0;
          
          const totalHits = correctHits + wrongHits;
          const accuracy = totalHits > 0 ? Math.round((correctHits / totalHits) * 100) : 0;
          
          finishSession({ game: "shape-hunter", level, stars, xp });
          
          // Navigate to result page
          navigate({
            to: "/arcade/result",
            search: {
              game: "shape-hunter",
              level: level,
              score: finalScore,
              stars: stars,
              xp: xp,
              accuracy: accuracy,
              combo: bestCombo,
              time: config.duration,
              details: JSON.stringify({
                "Correct Shapes": correctHits,
                "Wrong Shapes": wrongHits,
                "Max Combo": bestCombo
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
    <GameShell wide title="🔺 Shape Hunter">
      <div className="mb-4">
        <LevelPath 
          levels={5} 
          progress={player.mini["shape-hunter"]} 
          current={level} 
          onPick={l => { setLevel(l); setPlaying(false); }} 
        />
      </div>

      <div className="toy-card relative h-[60vh] min-h-[400px] overflow-hidden bg-gradient-to-b from-sky to-mint/30 touch-none">
        {/* HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <StatChip icon="🎯" value={SHAPES[config.target]} label="Target" />
          <div className="flex gap-2">
            <StatChip icon="🔥" value={`${combo}x`} className={combo > 3 ? "animate-pulse-glow" : ""} />
            <StatChip icon="⏱️" value={`${timeLeft}s`} />
            <StatChip icon="✨" value={score} />
          </div>
        </div>

        {/* Start Button */}
        {!playing && !countdown && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/10 backdrop-blur-[2px]">
            <JellyButton variant="sun" size="lg" onClick={startGame}>
              ▶️ Start Level {level}
            </JellyButton>
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && <Countdown value={countdown} />}

        {/* Floating Scores */}
        <FloatingScore items={floating} />

        {/* Game Area */}
        {shapes.map(s => (
          <button
            key={s.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl filter drop-shadow-md transition-transform active:scale-90"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onPointerDown={() => handleTap(s)}
          >
            {SHAPES[s.type]}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
