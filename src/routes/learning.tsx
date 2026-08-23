import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GameShell } from "@/components/Layout";
import { usePlayer, topicLabels, topicAccuracy, baselineAccuracy, topicGame } from "@/lib/store";
import { MascotBubble } from "@/components/Mascot";
import { JellyButton } from "@/components/bits";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [{ title: "AI Analysis" }],
  }),
  component: LearningPage,
});

function LearningPage() {
  const { player, level } = usePlayer();
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // Generate dynamic analysis
  const topics = Object.entries(player.topics).map(([key, data]) => {
    const acc = topicAccuracy(data, baselineAccuracy[key as keyof typeof baselineAccuracy]);
    return { key: key as keyof typeof topicLabels, acc, total: data.total };
  });

  const sorted = [...topics].sort((a, b) => b.acc - a.acc);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  
  const recGame = weakest ? topicGame[weakest.key] : topicGame["even"];

  let insight = `You've been playing well! You're ready for more challenges.`;
  
  if (player.gamesPlayed > 0 && strongest && weakest) {
    if (strongest.acc > 80 && weakest.acc > 70) {
      insight = `You are incredibly consistent across all subjects! Your ${topicLabels[strongest.key]} accuracy is a stellar ${strongest.acc}%. You're ready for Advanced difficulty in Carrom.`;
    } else if (strongest.acc - weakest.acc > 20) {
      insight = `You're extremely strong with ${topicLabels[strongest.key]} (${strongest.acc}%). However, I noticed you hesitate more with ${topicLabels[weakest.key]} (${weakest.acc}%). Let's reinforce that distinction!`;
    } else if (weakest.acc < 60) {
      insight = `Your overall progress is good, but ${topicLabels[weakest.key]} is slowing you down. A few quick practice rounds will boost your confidence!`;
    } else {
      insight = `You're improving steadily! Your ${topicLabels[strongest.key]} skills are growing fast.`;
    }
  }

  return (
    <GameShell wide title="🧠 AI Analysis">
      <div className="grid gap-6 md:grid-cols-2 mt-4">
        
        {/* Left Column: AI Coach */}
        <div className="flex flex-col gap-6">
          <div className="toy-card p-6 flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-mint/20 to-sky/20" />
             <div className="relative z-10 w-full">
               {analyzing ? (
                 <div className="py-12 flex flex-col items-center">
                   <div className="w-16 h-16 border-8 border-t-primary border-r-mint border-b-sun border-l-coral rounded-full animate-spin mb-4" />
                   <h2 className="font-display text-2xl text-primary animate-pulse">Analyzing your gameplay...</h2>
                   <p className="text-muted-foreground font-bold mt-2">Connecting to Striko's neural net...</p>
                 </div>
               ) : (
                 <div className="animate-pop-in">
                   <h2 className="font-display text-2xl text-primary mb-4">YOUR LEARNING INSIGHT</h2>
                   <MascotBubble mood="happy" size={100} text={insight} className="w-full text-left bg-background/80 backdrop-blur" />
                 </div>
               )}
             </div>
          </div>
          
          {!analyzing && (
            <div className="toy-card p-6 animate-rise" style={{ animationDelay: '200ms' }}>
              <h3 className="font-display text-xl mb-3 text-coral">Recommended Action</h3>
              <p className="font-bold text-muted-foreground mb-4">
                Based on your recent gameplay, Striko suggests playing {recGame.label} to improve your {topicLabels[weakest?.key || "even"]} accuracy.
              </p>
              <JellyButton to={recGame.to} variant="coral" className="w-full">
                Play {recGame.label}
              </JellyButton>
            </div>
          )}
        </div>

        {/* Right Column: Mastery Stats */}
        <div className="toy-card p-6 h-fit">
          <h3 className="font-display text-2xl mb-6">Subject Mastery</h3>
          <div className="flex flex-col gap-5">
            {sorted.map((t, i) => (
              <div key={t.key} className="flex flex-col gap-1">
                <div className="flex justify-between font-bold">
                  <span>{topicLabels[t.key]}</span>
                  <span className={t.acc > 80 ? 'text-mint-foreground' : t.acc < 60 ? 'text-destructive' : 'text-primary'}>
                    {t.acc}%
                  </span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      t.acc > 80 ? 'bg-gradient-play' : t.acc < 60 ? 'bg-destructive/80' : 'bg-gradient-sun'
                    }`}
                    style={{ width: analyzing ? '0%' : `${t.acc}%`, transitionDelay: `${i * 100}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </GameShell>
  );
}
