import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/Layout";
import { JellyButton, LevelPath, FloatingScore, ResultOverlay, Countdown, StatChip } from "@/components/bits";
import { usePlayer } from "@/lib/store";
import { sfx } from "@/lib/sfx";

export const Route = createFileRoute("/arcade/number-catcher")({
  head: () => ({
    meta: [{ title: "Number Catcher" }],
  }),
  component: NumberCatcher,
});

type FallingItem = {
  id: number;
  value: string;
  x: number;
  y: number;
  speed: number;
};

const LEVELS = [
  { id: 1, ops: ["+"], maxNum: 10, targetRange: [5, 20], speed: 0.3, duration: 45 },
  { id: 2, ops: ["+", "-"], maxNum: 20, targetRange: [1, 30], speed: 0.5, duration: 45 },
  { id: 3, ops: ["*", "+"], maxNum: 10, targetRange: [10, 50], speed: 0.7, duration: 45 },
  { id: 4, ops: ["*", "+", "-"], maxNum: 15, targetRange: [10, 80], speed: 0.9, duration: 40 },
  { id: 5, ops: ["*", "+", "-"], maxNum: 20, targetRange: [20, 100], speed: 1.2, duration: 30 },
];

function NumberCatcher() {
  const { player, finishSession, recordTopic } = usePlayer();
  const [level, setLevel] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  
  const [target, setTarget] = useState(0);
  const [equation, setEquation] = useState<string[]>([]);
  
  const [items, setItems] = useState<FallingItem[]>([]);
  const [floating, setFloating] = useState<{ id: number; x: number; y: number; text: string; good: boolean }[]>([]);
  const [result, setResult] = useState<{ stars: number; xp: number } | null>(null);

  const [bucketX, setBucketX] = useState(50); // percentage

  const reqRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const spawnTimerRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const config = LEVELS[level - 1];
  
  const stateRef = useRef({ items, playing, timeLeft, score, target, equation, bucketX });
  useEffect(() => {
    stateRef.current = { items, playing, timeLeft, score, target, equation, bucketX };
  }, [items, playing, timeLeft, score, target, equation, bucketX]);

  const generateTarget = () => {
    setTarget(Math.floor(Math.random() * (config.targetRange[1] - config.targetRange[0])) + config.targetRange[0]);
    setEquation([]);
  };

  const startGame = () => {
    setResult(null);
    setItems([]);
    setScore(0);
    setTimeLeft(config.duration);
    setFloating([]);
    generateTarget();
    
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
    const id = Date.now();
    setFloating(f => [...f, { id, x, y, text: pts > 0 ? `+${pts}` : `${pts}`, good }]);
    setTimeout(() => setFloating(f => f.filter(i => i.id !== id)), 800);
  };

  const evaluateEquation = (eq: string[]) => {
    try {
      // Evaluate left to right loosely
      let res = parseInt(eq[0]);
      for (let i = 1; i < eq.length; i += 2) {
        const op = eq[i];
        const num = parseInt(eq[i+1]);
        if (isNaN(num)) break;
        if (op === "+") res += num;
        if (op === "-") res -= num;
        if (op === "*") res *= num;
      }
      return res;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!playing) return;
    
    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      const st = stateRef.current;
      let nextItems = st.items.map(i => ({ ...i, y: i.y + config.speed * dt * 0.1 }));
      
      // Collision check with bucket (y around 85-95, x within 10% of bucketX)
      const bucketY = 90;
      nextItems = nextItems.filter(item => {
        if (item.y > 100) return false; // missed completely
        if (item.y > bucketY && item.y < bucketY + 5 && Math.abs(item.x - st.bucketX) < 10) {
          // caught!
          const lastIsOp = st.equation.length > 0 && isNaN(parseInt(st.equation[st.equation.length - 1]));
          const itemIsOp = isNaN(parseInt(item.value));
          
          if (st.equation.length === 0 && itemIsOp) {
            // Can't start with operator, ignore or penalize
            sfx.oops();
          } else if (lastIsOp && itemIsOp) {
             // Can't have two operators, ignore
             sfx.oops();
          } else if (!lastIsOp && !itemIsOp && st.equation.length > 0) {
             // Two numbers without op, ignore
             sfx.oops();
          } else {
             const newEq = [...st.equation, item.value];
             setEquation(newEq);
             sfx.click();
             
             // Check if complete expression evaluates to target
             if (!itemIsOp) {
               const val = evaluateEquation(newEq);
               if (val === st.target) {
                 sfx.play();
                 addScore(50, st.bucketX, bucketY, true);
                 recordTopic("arithmetic", true, 2000);
                 generateTarget();
               } else if (val !== null && val > st.target) {
                 // Overshot
                 sfx.oops();
                 addScore(-10, st.bucketX, bucketY, false);
                 setEquation([]);
               }
             }
          }
          return false;
        }
        return true;
      });
        
      // Spawn new items
      spawnTimerRef.current += dt;
      if (spawnTimerRef.current > 1200 / config.speed) {
        spawnTimerRef.current = 0;
        const isOp = Math.random() > 0.6;
        const value = isOp 
          ? config.ops[Math.floor(Math.random() * config.ops.length)]
          : Math.floor(Math.random() * config.maxNum + 1).toString();
          
        nextItems.push({
          id: Date.now(),
          value,
          x: 10 + Math.random() * 80,
          y: -10,
          speed: config.speed * (0.8 + Math.random() * 0.4),
        });
      }
      
      setItems(nextItems);
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
          finishSession({ game: "number-catcher", level, stars, xp });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [playing, level, finishSession]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!playing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBucketX(Math.max(5, Math.min(95, x)));
  };

  return (
    <GameShell wide title="🪣 Number Catcher">
      <div className="mb-4">
        <LevelPath 
          levels={5} 
          progress={player.mini["number-catcher"]} 
          current={level} 
          onPick={l => { setLevel(l); setPlaying(false); setResult(null); }} 
        />
      </div>

      <div 
        ref={containerRef}
        className="toy-card relative h-[60vh] min-h-[400px] overflow-hidden bg-gradient-to-b from-sky to-mint/30 touch-none"
        onPointerMove={handlePointerMove}
      >
        {/* HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <StatChip icon="🎯" value={target} label="Target" className={playing ? "ring-2 ring-primary bg-primary/10" : ""} />
          <div className="flex gap-2">
            <StatChip icon="⏱️" value={`${timeLeft}s`} />
            <StatChip icon="✨" value={score} />
          </div>
        </div>

        {/* Start Button */}
        {!playing && !countdown && !result && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/10 backdrop-blur-[2px]">
            <JellyButton variant="play" size="lg" onClick={startGame}>
              ▶️ Start Level {level}
            </JellyButton>
          </div>
        )}

        {countdown !== null && <Countdown value={countdown} />}
        <FloatingScore items={floating} />

        {/* Falling Items */}
        {items.map(s => (
          <div
            key={s.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-xl border-4 ${isNaN(parseInt(s.value)) ? 'bg-sun text-sun-foreground border-sun' : 'bg-card text-foreground border-card'} font-display text-2xl drop-shadow-md`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            {s.value}
          </div>
        ))}

        {/* Bucket / Current Equation */}
        <div 
          className="absolute bottom-4 transform -translate-x-1/2 z-20"
          style={{ left: `${bucketX}%`, transition: 'left 0.05s linear' }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-foreground/80 text-background px-4 py-2 rounded-xl font-display text-2xl min-w-[80px] text-center border-4 border-foreground/90 shadow-[0_4px_0_rgba(0,0,0,0.2)]">
              {equation.length === 0 ? "..." : equation.join(" ")}
            </div>
            <div className="text-4xl mt-1">🪣</div>
          </div>
        </div>

        {/* Result */}
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
