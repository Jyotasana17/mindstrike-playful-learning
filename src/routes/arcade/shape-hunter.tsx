import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/Layout";
import { JellyButton, LevelPath, FloatingScore, ResultOverlay, Countdown, StatChip } from "@/components/bits";
import { usePlayer } from "@/lib/store";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/arcade/shape-hunter")({
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
  { id: 1, target: "triangle", speed: 0.3, duration: 30, types: ["triangle", "circle"] as const },
  { id: 2, target: "circle", speed: 0.5, duration: 30, types: ["triangle", "circle", "square"] as const },
  { id: 3, target: "square", speed: 0.7, duration: 30, types: ["triangle", "circle", "square"] as const },
  { id: 4, target: "star", speed: 0.9, duration: 30, types: ["triangle", "circle", "square", "star"] as const },
  { id: 5, target: "triangle", speed: 1.2, duration: 25, types: ["triangle", "circle", "square", "star"] as const },
];

function ShapeHunter() {
  const { player, finishSession, recordTopic } = usePlayer();
  const [level, setLevel] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [floating, setFloating] = useState<{ id: number; x: number; y: number; text: string; good: boolean }[]>([]);
  const [result, setResult] = useState<{ stars: number; xp: number } | null>(null);

  const reqRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const spawnTimerRef = useRef<number>(0);
  const stateRef = useRef({ shapes, playing, timeLeft, score, combo });

  // Sync refs
  useEffect(() => {
    stateRef.current = { shapes, playing, timeLeft, score, combo };
  }, [shapes, playing, timeLeft, score, combo]);

  const config = LEVELS[level - 1];

  const startGame = () => {
    setResult(null);
    setShapes([]);
    setScore(0);
    setCombo(0);
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
    if (good) setCombo(c => c + 1);
    else setCombo(0);
    
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
      recordTopic("shapes", true, 500); // rough reaction time
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
      
      const { shapes: currentShapes, timeLeft: currentTL } = stateRef.current;
      
      // Update shapes
      let nextShapes = currentShapes.map(s => ({ ...s, y: s.y + s.speed * dt * 0.1 }))
        .filter(s => s.y < 110 && !s.clicked);
        
      // Spawn new shapes
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
          const finalScore = stateRef.current.score;
          const stars = finalScore > 150 ? 3 : finalScore > 80 ? 2 : finalScore > 30 ? 1 : 0;
          const xp = finalScore > 0 ? Math.floor(finalScore / 2) : 0;
          setResult({ stars, xp });
          sfx.cheer();
          finishSession({ game: "shape-hunter", level, stars, xp });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [playing, level, finishSession]);

  return (
    <GameShell wide title="🔺 Shape Hunter">
      <div className="mb-4">
        <LevelPath 
          levels={5} 
          progress={player.mini["shape-hunter"]} 
          current={level} 
          onPick={l => { setLevel(l); setPlaying(false); setResult(null); }} 
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
        {!playing && !countdown && !result && (
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

        {/* Result Overlay */}
        {result && (
          <ResultOverlay
            title={result.stars > 0 ? "Level Complete!" : "Time's up!"}
            message={`You scored ${score} points!`}
            stars={result.stars}
            xp={result.xp}
            onReplay={startGame}
            onNext={level < 5 && result.stars > 0 ? () => { setLevel(l => l + 1); setResult(null); } : undefined}
            backTo="/arcade"
            backLabel="Back to Arcade"
          />
        )}
      </div>
    </GameShell>
  );
}
