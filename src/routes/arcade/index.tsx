import { createFileRoute, Link } from "@tanstack/react-router";
import { GameShell } from "@/components/Layout";
import { JellyButton } from "@/components/bits";

export const Route = createFileRoute("/arcade/")({
  head: () => ({
    meta: [
      { title: "Mini Player — Arcade" },
    ],
  }),
  component: ArcadePage,
});

function ArcadePage() {
  return (
    <GameShell wide title="🎯 Mini Player">
      <div className="grid gap-6 md:grid-cols-3 mt-4">
        
        {/* Shape Hunter */}
        <div className="toy-card flex flex-col items-center p-6 text-center animate-rise">
          <div className="text-6xl mb-4">🔺</div>
          <h2 className="font-display text-2xl">Shape Hunter</h2>
          <p className="text-muted-foreground text-sm font-bold mt-2 mb-6">
            Find the correct shapes before time runs out!
          </p>
          <JellyButton to="/arcade/shape-hunter" variant="sun" className="mt-auto w-full">
            Play
          </JellyButton>
        </div>

        {/* Number Catcher */}
        <div className="toy-card flex flex-col items-center p-6 text-center animate-rise" style={{ animationDelay: '100ms' }}>
          <div className="text-6xl mb-4">🪣</div>
          <h2 className="font-display text-2xl">Number Catcher</h2>
          <p className="text-muted-foreground text-sm font-bold mt-2 mb-6">
            Catch numbers to build the target equation.
          </p>
          <JellyButton to="/arcade/number-catcher" variant="play" className="mt-auto w-full">
            Play
          </JellyButton>
        </div>

        {/* Target Strike */}
        <div className="toy-card flex flex-col items-center p-6 text-center animate-rise" style={{ animationDelay: '200ms' }}>
          <div className="text-6xl mb-4">☄️</div>
          <h2 className="font-display text-2xl">Target Strike</h2>
          <p className="text-muted-foreground text-sm font-bold mt-2 mb-6">
            Shoot the correct elements or numbers!
          </p>
          <JellyButton to="/arcade/target-strike" variant="primary" className="mt-auto w-full">
            Play
          </JellyButton>
        </div>

      </div>
    </GameShell>
  );
}
