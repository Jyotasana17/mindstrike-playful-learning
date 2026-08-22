import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePlayer, XP_PER_LEVEL, xpIntoLevel } from "@/lib/store";
import { StatChip } from "@/components/bits";

const NAV = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/map", label: "Adventure", icon: "🗺️" },
  { to: "/carrom", label: "Carrom", icon: "🎯" },
  { to: "/arcade", label: "Mini Player", icon: "🎮" },
  { to: "/learning", label: "My Progress", icon: "🧠" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export function SkyBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-10 left-0 h-40 w-40 rounded-full bg-card/70 blur-[2px] animate-drift" />
      <div className="absolute top-24 left-0 h-24 w-56 rounded-full bg-card/60 animate-drift-slow" />
      <div className="absolute top-64 left-0 h-20 w-40 rounded-full bg-card/50 animate-drift" style={{ animationDelay: "-20s" }} />
      {[...Array(14)].map((_, i) => (
        <span
          key={i}
          className="animate-twinkle absolute text-sun"
          style={{
            left: `${(i * 37) % 96}%`,
            top: `${(i * 53) % 90}%`,
            animationDelay: `${i * 0.4}s`,
            fontSize: `${10 + (i % 3) * 6}px`,
          }}
        >
          ✦
        </span>
      ))}
      <div className="absolute -bottom-24 -left-10 h-64 w-[60vw] rounded-[50%] bg-mint/50" />
      <div className="absolute -bottom-28 right-0 h-64 w-[55vw] rounded-[50%] bg-mint/40" />
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = shown;
    const diff = value - start;
    if (diff === 0) return;
    const tick = () => {
      frame += 1;
      const t = Math.min(1, frame / 26);
      setShown(Math.round(start + diff * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{shown}</>;
}

export function HUD() {
  const { player, level } = usePlayer();
  const pct = Math.round((xpIntoLevel(player.xp) / XP_PER_LEVEL) * 100);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        to="/profile"
        className="jelly flex items-center gap-2 rounded-full border-3 border-foreground/10 bg-card py-1.5 pr-4 pl-1.5"
      >
        <span className="bg-gradient-sun flex h-9 w-9 items-center justify-center rounded-full text-xl">
          {player.avatar}
        </span>
        <span className="text-left leading-tight">
          <span className="font-display block text-sm">Lv {level}</span>
          <span className="block h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <span className="bg-gradient-play block h-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </span>
        </span>
      </Link>
      <StatChip icon="✨" value={<AnimatedNumber value={player.xp} />} label="XP" />
      <StatChip icon="⭐" value={player.stars} />
      <StatChip icon="🔥" value={player.streak} />
      <StatChip icon="🪙" value={player.coins} className="hidden sm:flex" />
    </div>
  );
}

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-3 z-30 mx-auto mt-8 w-fit max-w-full">
      <ul className="flex items-center gap-1 overflow-x-auto rounded-full border-3 border-foreground/10 bg-card/95 p-2 shadow-[var(--shadow-toy)]">
        {NAV.map((n) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                className={cn(
                  "jelly flex min-w-16 flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-center",
                  active ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <span className="text-xl leading-none">{n.icon}</span>
                <span className="font-display text-[11px] leading-none">{n.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function GameShell({
  children,
  title,
  wide,
}: {
  children: ReactNode;
  title?: string;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <SkyBackdrop />
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <Link to="/" className="font-display text-2xl text-primary sm:text-3xl">
          Mind<span className="text-coral">Strike</span>
        </Link>
        <HUD />
      </header>
      <main className={cn("mx-auto px-4 pt-4", wide ? "max-w-6xl" : "max-w-5xl")}>
        {title && <h1 className="animate-rise font-display mb-4 text-3xl sm:text-4xl">{title}</h1>}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
