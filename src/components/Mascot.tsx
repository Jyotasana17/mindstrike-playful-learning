import { cn } from "@/lib/utils";

export type Mood = "happy" | "wave" | "celebrate" | "think" | "surprised" | "point";

/** Striko — the MindStrike mascot. A friendly round fox-cat spark creature. */
export function Mascot({
  mood = "happy",
  size = 120,
  className,
}: {
  mood?: Mood;
  size?: number;
  className?: string;
}) {
  const anim =
    mood === "celebrate"
      ? "animate-bounce-soft"
      : mood === "surprised"
        ? "animate-wobble"
        : "animate-bob";

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={cn(anim, "drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]", className)}
      role="img"
      aria-label="Striko the MindStrike mascot"
    >
      <defs>
        <radialGradient id="ms-body" cx="35%" cy="28%">
          <stop offset="0%" stopColor="oklch(0.85 0.15 60)" />
          <stop offset="100%" stopColor="oklch(0.68 0.19 42)" />
        </radialGradient>
      </defs>
      {/* ears */}
      <path d="M28 34 L22 10 L46 24 Z" fill="oklch(0.7 0.19 42)" />
      <path d="M92 34 L98 10 L74 24 Z" fill="oklch(0.7 0.19 42)" />
      <path d="M30 30 L27 17 L41 25 Z" fill="oklch(0.9 0.06 40)" />
      <path d="M90 30 L93 17 L79 25 Z" fill="oklch(0.9 0.06 40)" />
      {/* body */}
      <circle cx="60" cy="64" r="40" fill="url(#ms-body)" />
      <ellipse cx="60" cy="76" rx="26" ry="22" fill="oklch(0.97 0.03 80)" />
      {/* eyes */}
      {mood === "think" ? (
        <>
          <path d="M40 58 q7 -6 14 0" stroke="oklch(0.3 0.05 60)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M66 58 q7 -6 14 0" stroke="oklch(0.3 0.05 60)" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="47" cy="57" r={mood === "surprised" ? 9 : 7} fill="oklch(0.25 0.04 60)" />
          <circle cx="73" cy="57" r={mood === "surprised" ? 9 : 7} fill="oklch(0.25 0.04 60)" />
          <circle cx="49.5" cy="54.5" r="2.6" fill="oklch(0.99 0 0)" />
          <circle cx="75.5" cy="54.5" r="2.6" fill="oklch(0.99 0 0)" />
        </>
      )}
      {/* cheeks */}
      <circle cx="36" cy="70" r="6" fill="oklch(0.78 0.13 20)" opacity="0.55" />
      <circle cx="84" cy="70" r="6" fill="oklch(0.78 0.13 20)" opacity="0.55" />
      {/* mouth */}
      {mood === "surprised" ? (
        <ellipse cx="60" cy="74" rx="6" ry="8" fill="oklch(0.4 0.12 20)" />
      ) : (
        <path
          d="M50 72 q10 12 20 0"
          stroke="oklch(0.32 0.06 40)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {/* arms */}
      {mood === "wave" || mood === "celebrate" ? (
        <g className="origin-[24px_64px] animate-[wobble_0.9s_ease-in-out_infinite]">
          <circle cx="20" cy="46" r="9" fill="oklch(0.72 0.19 42)" />
        </g>
      ) : mood === "point" ? (
        <circle cx="102" cy="70" r="9" fill="oklch(0.72 0.19 42)" />
      ) : (
        <>
          <circle cx="20" cy="70" r="9" fill="oklch(0.72 0.19 42)" />
          <circle cx="100" cy="70" r="9" fill="oklch(0.72 0.19 42)" />
        </>
      )}
      {/* spark tuft */}
      <path d="M60 22 l6 12 h-12 z" fill="oklch(0.86 0.16 88)" />
    </svg>
  );
}

export function MascotBubble({
  text,
  mood = "happy",
  size = 110,
  className,
}: {
  text: string;
  mood?: Mood;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-2 sm:gap-3", className)}>
      <Mascot mood={mood} size={size} />
      <div className="animate-pop-in relative mb-4 max-w-[16rem] rounded-3xl border-3 border-foreground/10 bg-card px-4 py-3 text-sm font-bold shadow-[var(--shadow-toy)] sm:text-base">
        {text}
        <span className="absolute -left-2 bottom-4 h-4 w-4 rotate-45 border-b-3 border-l-3 border-foreground/10 bg-card" />
      </div>
    </div>
  );
}
