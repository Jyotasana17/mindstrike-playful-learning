import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sfx";

export function Stars({ count, size = 20 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={2.5}
          className={cn(
            "transition-transform",
            i < count ? "fill-sun text-sun-foreground animate-pop-in" : "fill-muted text-muted-foreground/50",
          )}
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </span>
  );
}

const variants = {
  sun: "bg-gradient-sun text-sun-foreground",
  play: "bg-gradient-play text-mint-foreground",
  grape: "bg-gradient-grape text-grape-foreground",
  coral: "bg-gradient-coral text-coral-foreground",
  primary: "bg-gradient-primary text-primary-foreground",
  cream: "bg-cream text-foreground",
} as const;

type BtnProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

export function JellyButton({
  children,
  variant = "primary",
  className,
  onClick,
  to,
  disabled,
  size = "md",
}: BtnProps) {
  const cls = cn(
    "jelly font-display inline-flex select-none items-center justify-center gap-2 text-center leading-none",
    variants[variant],
    size === "lg" ? "px-7 py-5 text-2xl" : size === "sm" ? "px-4 py-2.5 text-base" : "px-5 py-3.5 text-lg",
    disabled && "pointer-events-none opacity-50 grayscale",
    className,
  );
  const handle = () => {
    sfx.click();
    onClick?.();
  };
  if (to)
    return (
      <Link to={to} className={cls} onClick={handle}>
        {children}
      </Link>
    );
  return (
    <button type="button" className={cls} onClick={handle} disabled={disabled}>
      {children}
    </button>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("toy-card animate-rise p-5 sm:p-6", className)}>{children}</div>;
}

export function StatChip({
  icon,
  value,
  label,
  className,
}: {
  icon: ReactNode;
  value: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border-3 border-foreground/10 bg-card px-3 py-1.5 shadow-[var(--shadow-toy)]",
        className,
      )}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span className="font-display text-base leading-none">{value}</span>
      {label && <span className="text-xs font-bold text-muted-foreground">{label}</span>}
    </div>
  );
}

/** Winding level path for a mini game. */
export function LevelPath({
  levels,
  progress,
  onPick,
  current,
}: {
  levels: number;
  progress: Record<number, number>;
  onPick: (level: number) => void;
  current: number;
}) {
  const highestDone = Object.entries(progress).reduce(
    (acc, [k, v]) => (v > 0 ? Math.max(acc, Number(k)) : acc),
    0,
  );
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
      {Array.from({ length: levels }, (_, i) => i + 1).map((lvl) => {
        const unlocked = lvl <= highestDone + 1;
        const stars = progress[lvl] ?? 0;
        const isChallenge = lvl === levels;
        return (
          <button
            key={lvl}
            type="button"
            onClick={() => {
              if (!unlocked) {
                sfx.oops();
                return;
              }
              sfx.click();
              onPick(lvl);
            }}
            className={cn(
              "jelly relative flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border-4 sm:h-24 sm:w-24",
              unlocked
                ? isChallenge
                  ? "bg-gradient-grape border-card text-grape-foreground"
                  : "bg-gradient-sun border-card text-sun-foreground"
                : "border-card bg-locked text-card",
              lvl === current && "ring-6 ring-mint animate-pulse-glow",
              !unlocked && "hover:animate-wobble",
            )}
          >
            <span className="font-display text-2xl leading-none">
              {isChallenge ? "⭐" : unlocked ? lvl : <Lock size={22} />}
            </span>
            {unlocked && <Stars count={stars} size={12} />}
          </button>
        );
      })}
    </div>
  );
}

export function FloatingScore({ items }: { items: { id: number; x: number; y: number; text: string; good: boolean }[] }) {
  return (
    <>
      {items.map((f) => (
        <span
          key={f.id}
          className={cn(
            "animate-float-up font-display pointer-events-none absolute z-30 text-2xl drop-shadow",
            f.good ? "text-mint-foreground" : "text-destructive",
          )}
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          {f.text}
        </span>
      ))}
    </>
  );
}

export function ResultOverlay({
  title,
  message,
  stars,
  xp,
  onReplay,
  onNext,
  backTo,
  backLabel = "Back",
}: {
  title: string;
  message: string;
  stars: number;
  xp: number;
  onReplay: () => void;
  onNext?: () => void;
  backTo: string;
  backLabel?: string;
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/40 p-4">
      <div className="animate-pop-in toy-card w-full max-w-sm p-6 text-center">
        <h2 className="font-display text-4xl text-primary">{title}</h2>
        <div className="mt-3 flex justify-center">
          <Stars count={stars} size={40} />
        </div>
        <p className="mt-3 text-base font-bold">{message}</p>
        <p className="font-display mt-1 text-2xl text-tangerine">+{xp} XP</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <JellyButton variant="play" onClick={onReplay}>
            🔁 Play again
          </JellyButton>
          {onNext && (
            <JellyButton variant="sun" onClick={onNext}>
              ➡️ Next level
            </JellyButton>
          )}
          <JellyButton variant="cream" to={backTo}>
            {backLabel}
          </JellyButton>
        </div>
      </div>
    </div>
  );
}

export function Countdown({ value }: { value: string | number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
      <span key={String(value)} className="animate-pop-in font-display text-7xl text-card text-stroke sm:text-8xl">
        {value}
      </span>
    </div>
  );
}
