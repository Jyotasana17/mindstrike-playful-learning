import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Mascot } from "@/components/Mascot";
import { HUD, SkyBackdrop, BottomNav } from "@/components/Layout";
import { JellyButton, Panel } from "@/components/bits";
import { usePlayer } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindStrike — Play. Think. Learn." },
      {
        name: "description",
        content:
          "MindStrike is a playful learning game universe for kids: carrom number challenges, shape hunting, number catching and a friendly AI coach.",
      },
      { property: "og:title", content: "MindStrike — Play. Think. Learn." },
      {
        property: "og:description",
        content: "A colorful game world where children learn maths and science by playing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const ACTIONS = [
  { to: "/carrom", icon: "🎮", label: "Play", sub: "Carrom challenge", variant: "play" as const },
  { to: "/map", icon: "🗺️", label: "Adventure Map", sub: "5 worlds", variant: "sun" as const },
  { to: "/arcade", icon: "🎯", label: "Mini Player", sub: "3 arcade games", variant: "grape" as const },
  { to: "/learning", icon: "🧠", label: "My Progress", sub: "AI coach", variant: "primary" as const },
];

function Home() {
  const { player, ready, today } = usePlayer();
  const returning = player.gamesPlayed > 0;
  const dailyDone = player.dailyDoneDay === today;

  return (
    <div className="min-h-screen">
      <SkyBackdrop />
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <span className="font-display text-2xl text-primary sm:text-3xl">
          Mind<span className="text-coral">Strike</span>
        </span>
        <HUD />
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6">
        <section className="grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise">
            <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">
              Mind<span className="text-coral">Strike</span>
            </h1>
            <p className="font-display mt-2 text-2xl text-primary sm:text-3xl">Play. Think. Learn.</p>
            <p className="mt-3 max-w-md text-base font-bold text-muted-foreground">
              A game world where every shot, catch and tap makes you smarter.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <JellyButton to="/carrom" variant="play" size="lg">
                🎮 Play
              </JellyButton>
              <JellyButton to="/daily" variant="coral" size="lg" className={dailyDone ? "" : "animate-pulse-glow"}>
                🔥 Daily Challenge
              </JellyButton>
            </div>
          </div>

          <div className="flex items-end justify-center gap-2">
            <Mascot mood={returning ? "wave" : "happy"} size={190} />
            <div className="animate-pop-in toy-card mb-8 max-w-56 px-4 py-3">
              <p className="font-display text-lg">
                {ready && returning ? "Welcome back! Ready for today's challenge? 🚀" : "Hey! Ready for today's challenge? 🚀"}
              </p>
              <p className="mt-1 text-xs font-bold text-muted-foreground">— Striko</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((a, i) => (
            <Link
              key={a.to}
              to={a.to}
              className="lift toy-card animate-rise flex flex-col items-start gap-1 p-5"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="text-4xl">{a.icon}</span>
              <span className="font-display text-2xl">{a.label}</span>
              <span className="text-sm font-bold text-muted-foreground">{a.sub}</span>
              <span
                className={`jelly mt-3 rounded-full px-4 py-2 font-display text-sm ${
                  a.variant === "play"
                    ? "bg-gradient-play text-mint-foreground"
                    : a.variant === "sun"
                      ? "bg-gradient-sun text-sun-foreground"
                      : a.variant === "grape"
                        ? "bg-gradient-grape text-grape-foreground"
                        : "bg-gradient-primary text-primary-foreground"
                }`}
              >
                Let's go →
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Panel className="bg-gradient-sun">
            <p className="font-display text-xl">🔥 {player.streak}-day streak</p>
            <p className="mt-1 text-sm font-bold">Play one game today to keep it alive!</p>
          </Panel>
          <Panel>
            <p className="font-display text-xl">⭐ {player.stars} stars collected</p>
            <p className="mt-1 text-sm font-bold text-muted-foreground">Stars unlock new boards and skins.</p>
            <JellyButton to="/rewards" variant="cream" size="sm" className="mt-3">
              🎁 Rewards
            </JellyButton>
          </Panel>
          <Panel>
            <p className="font-display text-xl">🎮 {player.gamesPlayed} games played</p>
            <p className="mt-1 text-sm font-bold text-muted-foreground">Striko is watching your skills grow.</p>
            <JellyButton to="/learning" variant="cream" size="sm" className="mt-3">
              🧠 See my journey
            </JellyButton>
          </Panel>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

/** Kept for future server-side leaderboards. */
export const ping = createServerFn({ method: "GET" }).handler(async () => ({ ok: true }));
