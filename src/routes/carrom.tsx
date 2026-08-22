import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { GameShell } from "@/components/Layout";
import { Countdown, JellyButton, ResultOverlay, StatChip } from "@/components/bits";
import { MascotBubble } from "@/components/Mascot";
import { isComposite, isPrime, usePlayer, type TopicKey } from "@/lib/store";
import { sfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/carrom")({
  validateSearch: z.object({ world: z.number().min(1).max(5).optional() }),
  head: () => ({
    meta: [
      { title: "Carrom Number Challenge — MindStrike" },
      {
        name: "description",
        content:
          "Flick the striker into the right pocket: prime, even, odd or composite. A friendly illustrated carrom board with aim assist for kids.",
      },
      { property: "og:title", content: "Carrom Number Challenge — MindStrike" },
      { property: "og:description", content: "Learn number classification by playing carrom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarromPage,
});

/* ---------------- board constants (logical 600x600) ---------------- */
const S = 600;
const FRAME = 58;
const MIN = FRAME;
const MAX = S - FRAME;
const POCKET_R = 36;
const COIN_R = 17;
const STRIKER_R = 22;
const FRICTION = 0.986;

type Cat = "prime" | "even" | "odd" | "composite";
const POCKETS: { cat: Cat; label: string; x: number; y: number; color: string }[] = [
  { cat: "prime", label: "PRIME", x: MIN, y: MIN, color: "#3b82f6" },
  { cat: "even", label: "EVEN", x: MAX, y: MIN, color: "#22c55e" },
  { cat: "odd", label: "ODD", x: MAX, y: MAX, color: "#f97316" },
  { cat: "composite", label: "COMPOSITE", x: MIN, y: MAX, color: "#a855f7" },
];

const matches = (cat: Cat, n: number) =>
  cat === "prime" ? isPrime(n) : cat === "even" ? n % 2 === 0 : cat === "odd" ? n % 2 === 1 : isComposite(n);

type Coin = { x: number; y: number; vx: number; vy: number; n: number; done: boolean; hue: string };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

function makeCoins(world: number): Coin[] {
  const pool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 23, 25];
  const count = Math.min(9, 4 + world);
  const picked: number[] = [];
  while (picked.length < count) {
    const n = pool[Math.floor(Math.random() * pool.length)];
    if (!picked.includes(n)) picked.push(n);
  }
  const cx = S / 2;
  const cy = S / 2 - 20;
  return picked.map((n, i) => {
    const ring = i === 0 ? 0 : 1;
    const angle = (i / Math.max(1, count - 1)) * Math.PI * 2;
    const rad = ring === 0 ? 0 : 52 + (i % 2) * 30;
    return {
      x: cx + Math.cos(angle) * rad,
      y: cy + Math.sin(angle) * rad,
      vx: 0,
      vy: 0,
      n,
      done: false,
      hue: isPrime(n) ? "#3b82f6" : n % 2 === 0 ? "#22c55e" : "#f97316",
    };
  });
}

function CarromPage() {
  const search = Route.useSearch();
  const world = search.world ?? 1;
  const navigate = useNavigate();
  const { finishSession, recordTopic } = usePlayer();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinsRef = useRef<Coin[]>(makeCoins(world));
  const strikerRef = useRef({ x: S / 2, y: MAX - 46, vx: 0, vy: 0 });
  const partsRef = useRef<Particle[]>([]);
  const aimRef = useRef<{ dragging: boolean; dx: number; dy: number; power: number }>({
    dragging: false,
    dx: 0,
    dy: -1,
    power: 0,
  });
  const glowRef = useRef<Record<Cat, number>>({ prime: 0, even: 0, odd: 0, composite: 0 });
  const movingRef = useRef(false);

  const [assist, setAssist] = useState<"beginner" | "normal" | "expert">("beginner");
  const [strikerX, setStrikerX] = useState(S / 2);
  const [shots, setShots] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [left, setLeft] = useState(coinsRef.current.length);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const [mascot, setMascot] = useState("Drag from the striker to aim, then let go!");
  const [countdown, setCountdown] = useState<string | number | null>(3);
  const [result, setResult] = useState<{ stars: number; xp: number; title: string; message: string } | null>(null);

  const maxShots = useMemo(() => coinsRef.current.length + 4, [world]);

  const reset = useCallback(
    (w = world) => {
      coinsRef.current = makeCoins(w);
      strikerRef.current = { x: S / 2, y: MAX - 46, vx: 0, vy: 0 };
      partsRef.current = [];
      movingRef.current = false;
      setStrikerX(S / 2);
      setShots(0);
      setScore(0);
      setCombo(0);
      setWrong(0);
      setLeft(coinsRef.current.length);
      setResult(null);
      setFlash(null);
      setMascot("Drag from the striker to aim, then let go!");
      setCountdown(3);
    },
    [world],
  );

  useEffect(() => {
    reset(world);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world]);

  useEffect(() => {
    if (countdown === null) return;
    const seq: (string | number)[] = [3, 2, 1, "STRIKE!"];
    const idx = seq.indexOf(countdown);
    const t = setTimeout(() => {
      if (idx < seq.length - 1) setCountdown(seq[idx + 1]);
      else setCountdown(null);
    }, 600);
    return () => clearTimeout(t);
  }, [countdown]);

  const burst = (x: number, y: number, color: string, n = 14) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 4;
      partsRef.current.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color });
    }
  };

  const endLevel = useCallback(
    (pocketed: number, total: number, usedShots: number, wrongCount: number) => {
      const allDone = pocketed === total;
      let stars = 0;
      if (allDone && wrongCount === 0 && usedShots <= total + 1) stars = 3;
      else if (allDone) stars = 2;
      else if (pocketed >= Math.ceil(total / 2)) stars = 1;
      const xp = 40 + pocketed * 15 + stars * 20;
      finishSession({ game: "carrom", level: world, stars, xp, world });
      setResult({
        stars,
        xp,
        title: stars === 3 ? "PERFECT WORLD!" : allDone ? "WORLD CLEARED!" : "GOOD TRY!",
        message: allDone
          ? `You pocketed all ${total} coins in ${usedShots} shots.`
          : `${pocketed} of ${total} coins pocketed. Every try makes you sharper!`,
      });
      sfx.great();
    },
    [finishSession, world],
  );

  /* ---------------- game loop ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const collide = (a: { x: number; y: number; vx: number; vy: number }, ar: number, b: { x: number; y: number; vx: number; vy: number }, br: number, ma = 1, mb = 1) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d === 0 || d > ar + br) return false;
      const nx = dx / d;
      const ny = dy / d;
      const overlap = ar + br - d;
      a.x -= (nx * overlap * mb) / (ma + mb);
      a.y -= (ny * overlap * mb) / (ma + mb);
      b.x += (nx * overlap * ma) / (ma + mb);
      b.y += (ny * overlap * ma) / (ma + mb);
      const rvx = b.vx - a.vx;
      const rvy = b.vy - a.vy;
      const sep = rvx * nx + rvy * ny;
      if (sep > 0) return false;
      const imp = (-1.86 * sep) / (1 / ma + 1 / mb);
      a.vx -= (imp * nx) / ma;
      a.vy -= (imp * ny) / ma;
      b.vx += (imp * nx) / mb;
      b.vy += (imp * ny) / mb;
      return true;
    };

    const wall = (b: { x: number; y: number; vx: number; vy: number }, r: number) => {
      if (b.x - r < MIN) {
        b.x = MIN + r;
        b.vx = Math.abs(b.vx) * 0.86;
      }
      if (b.x + r > MAX) {
        b.x = MAX - r;
        b.vx = -Math.abs(b.vx) * 0.86;
      }
      if (b.y - r < MIN) {
        b.y = MIN + r;
        b.vy = Math.abs(b.vy) * 0.86;
      }
      if (b.y + r > MAX) {
        b.y = MAX - r;
        b.vy = -Math.abs(b.vy) * 0.86;
      }
    };

    const physics = () => {
      const striker = strikerRef.current;
      const coins = coinsRef.current;
      const bodies = [striker, ...coins.filter((c) => !c.done)];
      let moving = false;

      bodies.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        if (Math.hypot(b.vx, b.vy) < 0.09) {
          b.vx = 0;
          b.vy = 0;
        } else moving = true;
      });

      coins.forEach((c) => {
        if (!c.done) if (collide(striker, STRIKER_R, c, COIN_R, 1.7, 1)) sfx.hit();
      });
      for (let i = 0; i < coins.length; i++)
        for (let j = i + 1; j < coins.length; j++)
          if (!coins[i].done && !coins[j].done) collide(coins[i], COIN_R, coins[j], COIN_R);

      wall(striker, STRIKER_R);
      coins.forEach((c) => {
        if (!c.done) wall(c, COIN_R);
      });

      // pocket detection
      coins.forEach((c) => {
        if (c.done) return;
        for (const p of POCKETS) {
          if (Math.hypot(c.x - p.x, c.y - p.y) < POCKET_R) {
            c.done = true;
            const ok = matches(p.cat, c.n);
            glowRef.current[p.cat] = 1;
            burst(p.x, p.y, ok ? "#fbbf24" : "#94a3b8", ok ? 22 : 8);
            recordTopic(p.cat as TopicKey, ok);
            if (ok) {
              sfx.pocket();
              setCombo((k) => {
                const next = k + 1;
                setMascot(next >= 3 ? "You're on fire! 🔥" : "Awesome!");
                return next;
              });
              setScore((s) => s + 10);
              setFlash("PERFECT SHOT! +10 ⭐");
            } else {
              sfx.oops();
              setCombo(0);
              setWrong((w) => w + 1);
              setMascot("Almost! Try another angle.");
              setFlash("Almost! Try another angle.");
            }
            setLeft((l) => l - 1);
            setTimeout(() => setFlash(null), 1200);
            break;
          }
        }
      });

      partsRef.current = partsRef.current
        .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.12, life: p.life - 0.024 }))
        .filter((p) => p.life > 0);

      (Object.keys(glowRef.current) as Cat[]).forEach((k) => {
        glowRef.current[k] = Math.max(0, glowRef.current[k] - 0.02);
      });

      if (movingRef.current && !moving) {
        movingRef.current = false;
        striker.vx = 0;
        striker.vy = 0;
        striker.y = MAX - 46;
        striker.x = Math.min(MAX - 70, Math.max(MIN + 70, striker.x));
        setStrikerX(striker.x);
      }
      movingRef.current = moving;
    };

    const predict = () => {
      const { dx, dy, power } = aimRef.current;
      const sim = { x: strikerRef.current.x, y: strikerRef.current.y, vx: dx * power * 21, vy: dy * power * 21 };
      const pts: { x: number; y: number }[] = [{ x: sim.x, y: sim.y }];
      const steps = assist === "beginner" ? 220 : assist === "normal" ? 110 : 42;
      let hit: { x: number; y: number; coin: Coin } | null = null;
      for (let i = 0; i < steps; i++) {
        sim.x += sim.vx;
        sim.y += sim.vy;
        sim.vx *= FRICTION;
        sim.vy *= FRICTION;
        if (assist !== "expert") wall(sim, STRIKER_R);
        else {
          if (sim.x - STRIKER_R < MIN || sim.x + STRIKER_R > MAX || sim.y - STRIKER_R < MIN || sim.y + STRIKER_R > MAX) break;
        }
        const c = coinsRef.current.find((co) => !co.done && Math.hypot(co.x - sim.x, co.y - sim.y) < COIN_R + STRIKER_R);
        if (c) {
          hit = { x: sim.x, y: sim.y, coin: c };
          break;
        }
        if (i % 4 === 0) pts.push({ x: sim.x, y: sim.y });
        if (Math.hypot(sim.vx, sim.vy) < 0.4) break;
      }
      return { pts, hit };
    };

    const draw = () => {
      // frame / wood
      const wood = ctx.createLinearGradient(0, 0, S, S);
      wood.addColorStop(0, "#c78d४a".replace("४", "4"));
      wood.addColorStop(0.5, "#a9682f");
      wood.addColorStop(1, "#8a5222");
      ctx.fillStyle = wood;
      ctx.beginPath();
      ctx.roundRect(0, 0, S, S, 34);
      ctx.fill();

      // playfield
      const bed = ctx.createRadialGradient(S / 2, S / 2 - 40, 60, S / 2, S / 2, 340);
      bed.addColorStop(0, "#fbe9c6");
      bed.addColorStop(1, "#e9c78d");
      ctx.fillStyle = bed;
      ctx.beginPath();
      ctx.roundRect(MIN - 14, MIN - 14, MAX - MIN + 28, MAX - MIN + 28, 22);
      ctx.fill();
      ctx.strokeStyle = "rgba(120,72,30,0.35)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // center circle art
      ctx.save();
      ctx.translate(S / 2, S / 2);
      ctx.strokeStyle = "rgba(180,110,40,0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 96, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(251,191,36,0.25)";
      ctx.fill();
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(0, -48);
        ctx.lineTo(8, -66);
        ctx.lineTo(-8, -66);
        ctx.closePath();
        ctx.fillStyle = "rgba(249,115,22,0.25)";
        ctx.fill();
      }
      ctx.restore();

      // striker baseline
      ctx.strokeStyle = "rgba(120,72,30,0.4)";
      ctx.setLineDash([10, 8]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(MIN + 60, MAX - 46);
      ctx.lineTo(MAX - 60, MAX - 46);
      ctx.stroke();
      ctx.setLineDash([]);

      // pockets
      POCKETS.forEach((p) => {
        const g = glowRef.current[p.cat];
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_R + 16 + g * 8, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "33";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_R + 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_R - 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(35,22,10,0.85)";
        ctx.fill();
        if (g > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, POCKET_R + 20 * g, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(251,191,36,${g})`;
          ctx.lineWidth = 6;
          ctx.stroke();
        }
        ctx.fillStyle = "#fff8ea";
        ctx.font = "bold 17px 'Baloo 2', sans-serif";
        ctx.textAlign = "center";
        const lx = p.x < S / 2 ? p.x + 4 : p.x - 4;
        const ly = p.y < S / 2 ? p.y - POCKET_R - 14 : p.y + POCKET_R + 26;
        ctx.fillText(p.label, lx, ly);
        ctx.restore();
      });

      // aim guide
      if (aimRef.current.dragging && !movingRef.current) {
        const { pts, hit } = predict();
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 5;
        ctx.setLineDash([12, 10]);
        ctx.beginPath();
        pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
        ctx.stroke();
        ctx.setLineDash([]);
        if (hit) {
          ctx.beginPath();
          ctx.arc(hit.coin.x, hit.coin.y, COIN_R + 8, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(251,191,36,0.95)";
          ctx.lineWidth = 5;
          ctx.stroke();
        }
        ctx.restore();
      }

      // coins
      coinsRef.current.forEach((c) => {
        if (c.done) return;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(c.x, c.y + 5, COIN_R, COIN_R * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(80,50,20,0.22)";
        ctx.fill();
        const g = ctx.createRadialGradient(c.x - 6, c.y - 8, 3, c.x, c.y, COIN_R);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(0.25, c.hue);
        g.addColorStop(1, c.hue);
        ctx.beginPath();
        ctx.arc(c.x, c.y, COIN_R, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255,255,255,0.75)";
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px 'Baloo 2', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(c.n), c.x, c.y + 1);
        ctx.restore();
      });

      // striker
      const st = strikerRef.current;
      const scale = aimRef.current.dragging ? 1.12 : 1;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(st.x, st.y + 7, STRIKER_R, STRIKER_R * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(80,50,20,0.25)";
      ctx.fill();
      const sg = ctx.createRadialGradient(st.x - 8, st.y - 10, 4, st.x, st.y, STRIKER_R * scale);
      sg.addColorStop(0, "#ffffff");
      sg.addColorStop(0.6, "#fde68a");
      sg.addColorStop(1, "#f59e0b");
      ctx.beginPath();
      ctx.arc(st.x, st.y, STRIKER_R * scale, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.restore();

      // particles
      partsRef.current.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      physics();
      ctx.clearRect(0, 0, S, S);
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assist]);

  /* ---------------- input ---------------- */
  const toLogical = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * S, y: ((e.clientY - r.top) / r.height) * S };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (movingRef.current || result || countdown !== null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    aimRef.current.dragging = true;
    onMove(e);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!aimRef.current.dragging) return;
    const p = toLogical(e);
    const st = strikerRef.current;
    let dx = st.x - p.x;
    let dy = st.y - p.y;
    const d = Math.hypot(dx, dy) || 1;
    dx /= d;
    dy /= d;
    if (assist === "beginner") {
      // gently snap towards the best coin→pocket alignment
      let best: { dx: number; dy: number; diff: number } | null = null;
      coinsRef.current.forEach((c) => {
        if (c.done) return;
        const target = POCKETS.find((pk) => matches(pk.cat, c.n));
        if (!target) return;
        const tx = c.x - (target.x - c.x) * 0.16 - st.x;
        const ty = c.y - (target.y - c.y) * 0.16 - st.y;
        const tl = Math.hypot(tx, ty) || 1;
        const ndx = tx / tl;
        const ndy = ty / tl;
        const diff = Math.acos(Math.max(-1, Math.min(1, ndx * dx + ndy * dy)));
        if (diff < 0.16 && (!best || diff < best.diff)) best = { dx: ndx, dy: ndy, diff };
      });
      if (best) {
        dx = dx * 0.35 + best.dx * 0.65;
        dy = dy * 0.35 + best.dy * 0.65;
        const l = Math.hypot(dx, dy) || 1;
        dx /= l;
        dy /= l;
      }
    }
    aimRef.current.dx = dx;
    aimRef.current.dy = dy;
    aimRef.current.power = Math.min(1, d / 210);
  };

  const onUp = () => {
    if (!aimRef.current.dragging) return;
    aimRef.current.dragging = false;
    const { dx, dy, power } = aimRef.current;
    if (power < 0.08) return;
    const st = strikerRef.current;
    st.vx = dx * power * 21;
    st.vy = dy * power * 21;
    movingRef.current = true;
    sfx.shoot();
    setFlash("STRIKE!");
    setTimeout(() => setFlash(null), 700);
    setShots((s) => {
      const next = s + 1;
      const total = coinsRef.current.length;
      setTimeout(() => {
        const pocketed = coinsRef.current.filter((c) => c.done).length;
        if (pocketed === total || next >= maxShots) {
          const w = coinsRef.current.filter((c) => c.done).length;
          endLevel(w, total, next, wrong);
        }
      }, 2600);
      return next;
    });
  };

  const nextWorld = () => {
    const nw = Math.min(5, world + 1);
    navigate({ to: "/carrom", search: { world: nw } });
    reset(nw);
  };

  return (
    <GameShell wide>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">🎯 Carrom Challenge — World {world}</h1>
          <p className="text-sm font-bold text-muted-foreground">
            Send each coin into the pocket that matches it: prime, even, odd or composite.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatChip icon="🏅" value={score} label="score" />
          <StatChip icon="🔥" value={`x${combo}`} label="combo" />
          <StatChip icon="🎯" value={`${shots}/${maxShots}`} label="shots" />
          <StatChip icon="🪙" value={left} label="coins" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="relative mx-auto w-full max-w-[600px]">
          <canvas
            ref={canvasRef}
            width={S}
            height={S}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="w-full touch-none rounded-[2.2rem] shadow-[var(--shadow-pop)]"
            style={{ aspectRatio: "1 / 1" }}
          />
          {aimRef.current.dragging}
          {flash && (
            <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center">
              <span className="animate-pop-in font-display rounded-full bg-card/95 px-5 py-2 text-xl shadow-[var(--shadow-toy)]">
                {flash}
              </span>
            </div>
          )}
          {countdown !== null && <Countdown value={countdown} />}
          {result && (
            <ResultOverlay
              title={result.title}
              message={result.message}
              stars={result.stars}
              xp={result.xp}
              onReplay={() => reset(world)}
              onNext={world < 5 ? nextWorld : undefined}
              backTo="/map"
              backLabel="🗺️ Map"
            />
          )}

          <div className="mt-4">
            <label className="font-display flex items-center gap-3 text-sm">
              Striker position
              <input
                type="range"
                min={MIN + 70}
                max={MAX - 70}
                value={strikerX}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setStrikerX(v);
                  if (!movingRef.current) strikerRef.current.x = v;
                }}
                className="h-4 flex-1 accent-coral"
              />
            </label>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="toy-card p-4">
            <p className="font-display text-lg">🎚️ Aim helper</p>
            <div className="mt-2 grid gap-2">
              {(["beginner", "normal", "expert"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    sfx.click();
                    setAssist(m);
                  }}
                  className={cn(
                    "jelly font-display px-4 py-2.5 text-left text-base capitalize",
                    assist === m ? "bg-gradient-play text-mint-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {m === "beginner" ? "🐣 Beginner" : m === "normal" ? "🙂 Normal" : "🦅 Expert"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs font-bold text-muted-foreground">
              Beginner shows the full path with rebounds and nudges your aim. You can do this!
            </p>
          </div>
          <div className="toy-card p-4">
            <p className="font-display text-lg">Pockets</p>
            <ul className="mt-2 space-y-1 text-sm font-bold">
              <li>🔵 PRIME — 2, 3, 5, 7, 11…</li>
              <li>🟢 EVEN — 2, 4, 6, 8…</li>
              <li>🟠 ODD — 3, 5, 9, 15…</li>
              <li>🟣 COMPOSITE — 4, 6, 9, 25…</li>
            </ul>
          </div>
          <JellyButton variant="cream" className="w-full" onClick={() => reset(world)}>
            🔁 Restart world
          </JellyButton>
        </aside>
      </div>

      <MascotBubble className="mt-5" size={92} mood={combo >= 3 ? "celebrate" : "happy"} text={mascot} />
    </GameShell>
  );
}
