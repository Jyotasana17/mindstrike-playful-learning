import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { GameShell } from "@/components/Layout";
import { JellyButton, Stars } from "@/components/bits";
import { MascotBubble } from "@/components/Mascot";
import { usePlayer } from "@/lib/store";
import { sfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Adventure Map — MindStrike Worlds" },
      {
        name: "description",
        content: "Travel from Number Garden to Knowledge Lab. Five colorful MindStrike worlds, three stars each.",
      },
      { property: "og:title", content: "Adventure Map — MindStrike Worlds" },
      { property: "og:description", content: "A winding journey through five learning worlds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

const WORLDS = [
  { id: 1, name: "Number Garden", icon: "🌱", tint: "bg-gradient-play", x: 14, y: 82, topic: "Even & odd numbers" },
  { id: 2, name: "Prime Valley", icon: "🔢", tint: "bg-gradient-sun", x: 36, y: 62, topic: "Prime numbers" },
  { id: 3, name: "Composite Castle", icon: "🏰", tint: "bg-gradient-coral", x: 58, y: 76, topic: "Composite numbers" },
  { id: 4, name: "Number Space", icon: "🚀", tint: "bg-gradient-primary", x: 74, y: 44, topic: "Mixed classification" },
  { id: 5, name: "Knowledge Lab", icon: "🧪", tint: "bg-gradient-grape", x: 90, y: 22, topic: "Challenge world" },
];

function MapPage() {
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [wobble, setWobble] = useState(0);

  const highestDone = WORLDS.reduce((acc, w) => ((player.worlds[w.id] ?? 0) > 0 ? Math.max(acc, w.id) : acc), 0);
  const currentId = Math.min(WORLDS.length, highestDone + 1);
  const current = WORLDS.find((w) => w.id === currentId)!;

  return (
    <GameShell wide>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">🗺️ Adventure Map</h1>
          <p className="text-sm font-bold text-muted-foreground">
            Now exploring: {current.icon} {current.name} — {current.topic}
          </p>
        </div>
        <JellyButton variant="play" to="/carrom">
          ▶️ Play {current.name}
        </JellyButton>
      </div>

      <div className="toy-card relative h-[26rem] overflow-hidden p-0 sm:h-[32rem]">
        <div className="absolute inset-0 bg-gradient-to-b from-sky to-mint/60" />
        <div className="absolute -bottom-16 left-[-5%] h-56 w-[70%] rounded-[50%] bg-mint/70" />
        <div className="absolute -bottom-10 right-[-10%] h-48 w-[60%] rounded-[50%] bg-mint/60" />
        <div className="absolute top-6 left-6 h-16 w-32 rounded-full bg-card/70 animate-drift" />
        <div className="absolute top-20 left-0 h-10 w-24 rounded-full bg-card/60 animate-drift-slow" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={WORLDS.map((w) => `${w.x},${w.y}`).join(" ")}
            fill="none"
            stroke="oklch(0.95 0.03 92)"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeDasharray="6 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {WORLDS.map((w) => {
          const unlocked = w.id <= highestDone + 1;
          const stars = player.worlds[w.id] ?? 0;
          const isCurrent = w.id === currentId;
          return (
            <div key={w.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${w.x}%`, top: `${w.y}%` }}>
              <button
                type="button"
                onClick={() => {
                  if (!unlocked) {
                    sfx.oops();
                    setWobble(w.id);
                    setTimeout(() => setWobble(0), 500);
                    return;
                  }
                  sfx.click();
                  navigate({ to: "/carrom", search: { world: w.id } });
                }}
                className={cn(
                  "jelly flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border-4 border-card sm:h-24 sm:w-24",
                  unlocked ? w.tint : "bg-locked",
                  isCurrent && "ring-6 ring-sun animate-pulse-glow",
                  wobble === w.id && "animate-wobble",
                )}
              >
                <span className="text-2xl leading-none sm:text-3xl">{unlocked ? w.icon : <Lock className="text-card" />}</span>
                <span className="font-display text-xs leading-none text-card">Lv {w.id}</span>
                {unlocked && <Stars count={stars} size={11} />}
              </button>
              <p className="font-display mt-1 w-28 -translate-x-[14%] text-center text-xs leading-tight drop-shadow-sm sm:text-sm">
                {w.name}
              </p>
              {isCurrent && (
                <span className="animate-bob pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-3xl">🦊</span>
              )}
            </div>
          );
        })}
      </div>

      <MascotBubble
        className="mt-5"
        mood="point"
        size={90}
        text={
          highestDone === 0
            ? "Start in Number Garden — I'll show you how to strike!"
            : highestDone >= WORLDS.length
              ? "All worlds explored! Go for 3 stars everywhere ⭐"
              : `Nice! ${current.name} is open. Let's grab three stars!`
        }
      />
    </GameShell>
  );
}
