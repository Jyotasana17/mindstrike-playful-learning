import { createFileRoute } from "@tanstack/react-router";
import { GameShell } from "@/components/Layout";
import { JellyButton } from "@/components/bits";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [{ title: "Rewards" }],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  return (
    <GameShell wide title="🎁 Rewards">
      <div className="toy-card flex min-h-[400px] flex-col items-center justify-center text-center">
        <h2 className="font-display text-4xl mb-4 text-sun">Coming Soon!</h2>
        <p className="text-muted-foreground font-bold mb-8">
          The reward shop is being restocked. Check back later!
        </p>
        <JellyButton to="/" variant="cream">
          ← Back to Home
        </JellyButton>
      </div>
    </GameShell>
  );
}
