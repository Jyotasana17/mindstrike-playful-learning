import { useCallback, useEffect, useState } from "react";

export type TopicKey = "prime" | "even" | "odd" | "composite" | "shapes" | "arithmetic" | "elements";

export type MiniGameKey = "shape-hunter" | "number-catcher" | "target-strike" | "carrom";

export type PlayerState = {
  name: string;
  avatar: string;
  xp: number;
  stars: number;
  coins: number;
  streak: number;
  gamesPlayed: number;
  lastPlayDay: string;
  dailyDoneDay: string;
  /** stars per world level id (1-5) */
  worlds: Record<number, number>;
  /** stars per mini game level */
  mini: Record<MiniGameKey, Record<number, number>>;
  topics: Record<TopicKey, { correct: number; total: number; ms: number }>;
  badges: string[];
  unlocked: string[];
};

const STORAGE_KEY = "mindstrike.player.v1";

export const emptyTopics = (): PlayerState["topics"] => ({
  prime: { correct: 0, total: 0, ms: 0 },
  even: { correct: 0, total: 0, ms: 0 },
  odd: { correct: 0, total: 0, ms: 0 },
  composite: { correct: 0, total: 0, ms: 0 },
  shapes: { correct: 0, total: 0, ms: 0 },
  arithmetic: { correct: 0, total: 0, ms: 0 },
  elements: { correct: 0, total: 0, ms: 0 },
});

export const defaultPlayer = (): PlayerState => ({
  name: "Explorer",
  avatar: "🦊",
  xp: 40,
  stars: 0,
  coins: 25,
  streak: 1,
  gamesPlayed: 0,
  lastPlayDay: "",
  dailyDoneDay: "",
  worlds: { 1: 0 },
  mini: {
    "shape-hunter": {},
    "number-catcher": {},
    "target-strike": {},
    carrom: {},
  },
  topics: emptyTopics(),
  badges: [],
  unlocked: ["board-classic", "striker-classic"],
});

export const levelFromXp = (xp: number) => Math.max(1, Math.floor(xp / 250) + 1);
export const xpIntoLevel = (xp: number) => xp % 250;
export const XP_PER_LEVEL = 250;

const today = () => new Date().toISOString().slice(0, 10);

let memory: PlayerState | null = null;
const listeners = new Set<() => void>();

function read(): PlayerState {
  if (memory) return memory;
  if (typeof window === "undefined") return defaultPlayer();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    memory = raw ? { ...defaultPlayer(), ...JSON.parse(raw) } : defaultPlayer();
  } catch {
    memory = defaultPlayer();
  }
  return memory;
}

function write(next: PlayerState) {
  memory = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

export function usePlayer() {
  const [player, setPlayer] = useState<PlayerState>(defaultPlayer);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setPlayer({ ...read() });
    sync();
    setReady(true);
    listeners.add(sync);
    return () => listeners.delete(sync);
  }, []);

  const update = useCallback((fn: (p: PlayerState) => PlayerState) => {
    write(fn({ ...read() }));
  }, []);

  const addXp = useCallback(
    (xp: number) => update((p) => ({ ...p, xp: p.xp + xp })),
    [update],
  );

  const recordTopic = useCallback(
    (topic: TopicKey, correct: boolean, ms = 900) =>
      update((p) => ({
        ...p,
        topics: {
          ...p.topics,
          [topic]: {
            correct: p.topics[topic].correct + (correct ? 1 : 0),
            total: p.topics[topic].total + 1,
            ms: p.topics[topic].ms + ms,
          },
        },
      })),
    [update],
  );

  const finishSession = useCallback(
    (opts: {
      game: MiniGameKey;
      level: number;
      stars: number;
      xp: number;
      coins?: number;
      badge?: string;
      world?: number;
    }) =>
      update((p) => {
        const prevMini = p.mini[opts.game]?.[opts.level] ?? 0;
        const day = today();
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streak =
          p.lastPlayDay === day ? p.streak : p.lastPlayDay === yesterday ? p.streak + 1 : 1;
        const gainedStars = Math.max(0, opts.stars - prevMini);
        const prevWorld = opts.world ? (p.worlds[opts.world] ?? 0) : 0;
        const worldGain = opts.world ? Math.max(0, opts.stars - prevWorld) : 0;
        return {
          ...p,
          xp: p.xp + opts.xp,
          coins: p.coins + (opts.coins ?? Math.round(opts.xp / 4)),
          stars: p.stars + gainedStars + worldGain,
          streak,
          lastPlayDay: day,
          gamesPlayed: p.gamesPlayed + 1,
          badges: opts.badge && !p.badges.includes(opts.badge) ? [...p.badges, opts.badge] : p.badges,
          mini: {
            ...p.mini,
            [opts.game]: { ...p.mini[opts.game], [opts.level]: Math.max(prevMini, opts.stars) },
          },
          worlds: opts.world
            ? {
                ...p.worlds,
                [opts.world]: Math.max(prevWorld, opts.stars),
                ...(opts.stars > 0 ? { [opts.world + 1]: p.worlds[opts.world + 1] ?? 0 } : {}),
              }
            : p.worlds,
        };
      }),
    [update],
  );

  const completeDaily = useCallback(
    () =>
      update((p) => ({
        ...p,
        dailyDoneDay: today(),
        xp: p.xp + 100,
        coins: p.coins + 40,
        badges: p.badges.includes("daily-hero") ? p.badges : [...p.badges, "daily-hero"],
      })),
    [update],
  );

  const buy = useCallback(
    (id: string, cost: number) =>
      update((p) =>
        p.unlocked.includes(id) || p.coins < cost
          ? p
          : { ...p, coins: p.coins - cost, unlocked: [...p.unlocked, id] },
      ),
    [update],
  );

  const reset = useCallback(() => write(defaultPlayer()), []);

  return {
    player,
    ready,
    level: levelFromXp(player.xp),
    addXp,
    recordTopic,
    finishSession,
    completeDaily,
    buy,
    reset,
    today: today(),
  };
}

export const topicLabels: Record<TopicKey, string> = {
  prime: "Prime Numbers",
  even: "Even Numbers",
  odd: "Odd Numbers",
  composite: "Composite Numbers",
  shapes: "Shapes & Vision",
  arithmetic: "Quick Arithmetic",
  elements: "Elements & Groups",
};

export const topicGame: Record<TopicKey, { game: string; label: string; to: string }> = {
  prime: { game: "carrom", label: "Carrom Number Challenge", to: "/carrom" },
  even: { game: "carrom", label: "Carrom Number Challenge", to: "/carrom" },
  odd: { game: "carrom", label: "Carrom Number Challenge", to: "/carrom" },
  composite: { game: "target-strike", label: "Target Strike", to: "/arcade/target-strike" },
  shapes: { game: "shape-hunter", label: "Shape Hunter", to: "/arcade/shape-hunter" },
  arithmetic: { game: "number-catcher", label: "Number Catcher", to: "/arcade/number-catcher" },
  elements: { game: "target-strike", label: "Target Strike", to: "/arcade/target-strike" },
};

export function topicAccuracy(t: { correct: number; total: number }, fallback: number) {
  if (t.total < 3) return fallback;
  return Math.round((t.correct / t.total) * 100);
}

/** Deterministic-ish baseline so a fresh profile still shows a friendly picture. */
export const baselineAccuracy: Record<TopicKey, number> = {
  prime: 88,
  even: 79,
  odd: 64,
  composite: 71,
  shapes: 86,
  arithmetic: 74,
  elements: 68,
};

export const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
export const isComposite = (n: number) => n > 1 && !isPrime(n);
