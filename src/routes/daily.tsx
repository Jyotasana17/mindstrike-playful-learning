import { createFileRoute } from "@tanstack/react-router";
import { GameShell } from "@/components/Layout";
import { JellyButton } from "@/components/bits";

export const Route = createFileRoute("/daily")({
  head: () => ({
    meta: [{ title: "Daily Challenge" }],
  }),
  component: DailyPage,
});

function DailyPage() {
  return (
    <GameShell wide title="🔥 Daily Challenge">
      <div className="toy-card flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="font-display text-4xl mb-4 text-coral">Coming Soon!</h2>
        <p className="text-muted-foreground font-bold mb-8">
          Striko is preparing today's challenge. Check back later!
        </p>
        <JellyButton to="/" variant="cream">
          ← Back to Home
        </JellyButton>
      </div>
    </GameShell>
  );
}
