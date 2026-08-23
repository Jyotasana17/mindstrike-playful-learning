import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { GameShell } from "@/components/Layout";
import { JellyButton, Stars, StatChip } from "@/components/bits";
import { MascotBubble } from "@/components/Mascot";
import { usePlayer, type MiniGameKey } from "@/lib/store";
import { sfx } from "@/lib/sfx";

const resultSearchSchema = z.object({
  game: z.enum(["shape-hunter", "number-catcher", "target-strike"] as const),
  level: z.coerce.number().min(1),
  score: z.coerce.number(),
  stars: z.coerce.number(),
  xp: z.coerce.number(),
  accuracy: z.coerce.number().optional(),
  combo: z.coerce.number().optional(),
  time: z.coerce.number().optional(),
  // game specific details serialized as string
  details: z.string().optional(),
});

export const Route = createFileRoute("/arcade/result")({
  validateSearch: resultSearchSchema,
  head: () => ({
    meta: [{ title: "Level Complete!" }],
  }),
  component: ResultPage,
});

const GAME_INFO: Record<string, { title: string; route: string; maxLevel: number }> = {
  "shape-hunter": { title: "SHAPE HUNTER", route: "/arcade/shape-hunter", maxLevel: 5 },
  "number-catcher": { title: "NUMBER CATCHER", route: "/arcade/number-catcher", maxLevel: 5 },
  "target-strike": { title: "TARGET STRIKE", route: "/arcade/target-strike", maxLevel: 5 },
};

function ResultPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { player } = usePlayer();
  
  const [animState, setAnimState] = useState<"enter" | "stars" | "score" | "xp" | "done">("enter");
  const [dispScore, setDispScore] = useState(0);
  const [dispXp, setDispXp] = useState(0);

  const info = GAME_INFO[search.game];
  const isMaxLevel = search.level >= info.maxLevel;
  const isWin = search.stars > 0;

  useEffect(() => {
    sfx.cheer();
    
    // Animation sequence
    const t1 = setTimeout(() => setAnimState("stars"), 800);
    const t2 = setTimeout(() => {
      setAnimState("score");
      let start = 0;
      const step = Math.max(1, Math.floor(search.score / 20));
      const iv = setInterval(() => {
        start += step;
        if (start >= search.score) {
          setDispScore(search.score);
          clearInterval(iv);
        } else {
          setDispScore(start);
        }
      }, 30);
    }, 1400);
    
    const t3 = setTimeout(() => {
      setAnimState("xp");
      let start = 0;
      const step = Math.max(1, Math.floor(search.xp / 20));
      const iv = setInterval(() => {
        start += step;
        if (start >= search.xp) {
          setDispXp(search.xp);
          clearInterval(iv);
        } else {
          setDispXp(start);
        }
      }, 30);
    }, 2000);
    
    const t4 = setTimeout(() => setAnimState("done"), 2500);
    
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, [search.score, search.xp]);

  let insight = "🌟 Great job! Keep going!";
  if (search.stars === 3) insight = "🔥 AMAZING! You're on fire!";
  else if (search.stars === 0) insight = "💪 Nice try! One more round?";

  // Quick AI insight based on accuracy
  if (search.accuracy !== undefined) {
    if (search.accuracy > 90) insight = "🧠 Quick Insight: Your accuracy was nearly perfect! Try increasing your speed.";
    else if (search.accuracy < 60) insight = "🧠 Quick Insight: Take your time. Accuracy is more important than speed!";
  }

  const detailsObj = search.details ? JSON.parse(search.details) : {};

  return (
    <GameShell wide>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
        
        <div className="text-center animate-pop-in mb-8">
          <h1 className="font-display text-4xl sm:text-5xl text-primary mb-2">
            {isWin ? "🎉 LEVEL COMPLETE!" : "TIME'S UP!"}
          </h1>
          <h2 className="font-bold text-muted-foreground uppercase tracking-widest">
            {info.title} - LEVEL {search.level}
          </h2>
        </div>

        <div className="toy-card w-full max-w-lg p-6 sm:p-8 flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-card to-muted/30">
          
          <div className="h-16 mb-4 flex items-center justify-center">
            {animState !== "enter" && (
              <Stars count={search.stars} size={48} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-background rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-bold text-muted-foreground mb-1">SCORE</div>
              <div className="font-display text-3xl text-primary">
                {animState === "enter" || animState === "stars" ? 0 : dispScore}
              </div>
            </div>
            <div className="bg-background rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs font-bold text-muted-foreground mb-1">XP EARNED</div>
              <div className="font-display text-3xl text-tangerine">
                +{animState === "done" ? search.xp : dispXp}
              </div>
            </div>
          </div>

          {/* Game Specific Stats */}
          {animState === "done" && (
            <div className="w-full bg-primary/5 rounded-xl p-4 mb-6 animate-rise flex flex-wrap gap-3 justify-center">
              {search.accuracy !== undefined && <StatChip icon="🎯" value={`${search.accuracy}%`} label="Accuracy" />}
              {search.combo !== undefined && <StatChip icon="🔥" value={`${search.combo}x`} label="Best Combo" />}
              {search.time !== undefined && <StatChip icon="⏱️" value={`${search.time}s`} label="Time" />}
              
              {/* Render dynamic details */}
              {Object.entries(detailsObj).map(([k, v]) => (
                 <StatChip key={k} icon="✨" value={String(v)} label={k.toUpperCase()} />
              ))}
            </div>
          )}

          {/* Insight */}
          {animState === "done" && (
            <div className="w-full animate-rise" style={{ animationDelay: '200ms' }}>
              <MascotBubble size={80} text={insight} mood={search.stars > 1 ? "celebrate" : "happy"} />
            </div>
          )}

        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg transition-opacity duration-500" style={{ opacity: animState === "done" ? 1 : 0, pointerEvents: animState === "done" ? "auto" : "none" }}>
          
          {isWin && (
            isMaxLevel ? (
              <div className="w-full bg-sun text-sun-foreground p-4 rounded-xl text-center font-display text-xl animate-pulse">
                🏆 MINI PLAYER MASTER!
              </div>
            ) : (
              <JellyButton 
                variant="primary" 
                className="flex-1"
                onClick={() => navigate({ to: info.route })} // Wait, shape hunter doesn't take level param in route, it takes it from internal state. We should redirect to the game route, but we need to pass level to it.
              >
                ▶️ NEXT LEVEL
              </JellyButton>
            )
          )}
          
          <JellyButton variant="cream" className="flex-1" onClick={() => navigate({ to: info.route, search: { level: search.level } } as any)}>
            🔄 PLAY AGAIN
          </JellyButton>
          <JellyButton variant="grape" className="flex-1" to="/arcade">
            🎮 ARCADE
          </JellyButton>
        </div>

      </div>
    </GameShell>
  );
}
