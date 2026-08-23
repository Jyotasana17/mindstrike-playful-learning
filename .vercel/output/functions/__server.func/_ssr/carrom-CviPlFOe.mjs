import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as sfx, f as StatChip, g as isPrime, h as isComposite, i as GameShell, l as ResultOverlay, m as cn, n as Countdown, o as JellyButton, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
import { t as Route } from "./carrom-BZQtZE9K.mjs";
import { n as MascotBubble } from "./Mascot-DVIeqxcP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carrom-CviPlFOe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var S = 600;
var MIN = 58;
var MAX = 542;
var POCKET_R = 36;
var COIN_R = 17;
var STRIKER_R = 22;
var FRICTION = .986;
var POCKETS = [
	{
		cat: "prime",
		label: "PRIME",
		x: MIN,
		y: MIN,
		color: "#3b82f6"
	},
	{
		cat: "even",
		label: "EVEN",
		x: MAX,
		y: MIN,
		color: "#22c55e"
	},
	{
		cat: "odd",
		label: "ODD",
		x: MAX,
		y: MAX,
		color: "#f97316"
	},
	{
		cat: "composite",
		label: "COMPOSITE",
		x: MIN,
		y: MAX,
		color: "#a855f7"
	}
];
var matches = (cat, n) => cat === "prime" ? isPrime(n) : cat === "even" ? n % 2 === 0 : cat === "odd" ? n % 2 === 1 : isComposite(n);
function makeCoins(world) {
	const pool = [
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		21,
		23,
		25
	];
	const count = Math.min(9, 4 + world);
	const picked = [];
	while (picked.length < count) {
		const n = pool[Math.floor(Math.random() * pool.length)];
		if (!picked.includes(n)) picked.push(n);
	}
	const cx = S / 2;
	const cy = S / 2 - 20;
	return picked.map((n, i) => {
		const ring = i === 0 ? 0 : 1;
		const angle = i / Math.max(1, count - 1) * Math.PI * 2;
		const rad = ring === 0 ? 0 : 52 + i % 2 * 30;
		return {
			x: cx + Math.cos(angle) * rad,
			y: cy + Math.sin(angle) * rad,
			vx: 0,
			vy: 0,
			n,
			done: false,
			hue: isPrime(n) ? "#3b82f6" : n % 2 === 0 ? "#22c55e" : "#f97316"
		};
	});
}
function CarromPage() {
	const world = Route.useSearch().world ?? 1;
	const navigate = useNavigate();
	const { finishSession, recordTopic } = usePlayer();
	const canvasRef = (0, import_react.useRef)(null);
	const coinsRef = (0, import_react.useRef)(makeCoins(world));
	const strikerRef = (0, import_react.useRef)({
		x: S / 2,
		y: 496,
		vx: 0,
		vy: 0
	});
	const partsRef = (0, import_react.useRef)([]);
	const aimRef = (0, import_react.useRef)({
		dragging: false,
		dx: 0,
		dy: -1,
		power: 0
	});
	const glowRef = (0, import_react.useRef)({
		prime: 0,
		even: 0,
		odd: 0,
		composite: 0
	});
	const movingRef = (0, import_react.useRef)(false);
	const [assist, setAssist] = (0, import_react.useState)("beginner");
	const [strikerX, setStrikerX] = (0, import_react.useState)(S / 2);
	const [shots, setShots] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [left, setLeft] = (0, import_react.useState)(coinsRef.current.length);
	const [wrong, setWrong] = (0, import_react.useState)(0);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const [mascot, setMascot] = (0, import_react.useState)("Drag from the striker to aim, then let go!");
	const [countdown, setCountdown] = (0, import_react.useState)(3);
	const [result, setResult] = (0, import_react.useState)(null);
	const maxShots = (0, import_react.useMemo)(() => coinsRef.current.length + 4, [world]);
	const reset = (0, import_react.useCallback)((w = world) => {
		coinsRef.current = makeCoins(w);
		strikerRef.current = {
			x: S / 2,
			y: 496,
			vx: 0,
			vy: 0
		};
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
	}, [world]);
	(0, import_react.useEffect)(() => {
		reset(world);
	}, [world]);
	(0, import_react.useEffect)(() => {
		if (countdown === null) return;
		const seq = [
			3,
			2,
			1,
			"STRIKE!"
		];
		const idx = seq.indexOf(countdown);
		const t = setTimeout(() => {
			if (idx < seq.length - 1) setCountdown(seq[idx + 1]);
			else setCountdown(null);
		}, 600);
		return () => clearTimeout(t);
	}, [countdown]);
	const burst = (x, y, color, n = 14) => {
		for (let i = 0; i < n; i++) {
			const a = Math.random() * Math.PI * 2;
			const sp = 2 + Math.random() * 4;
			partsRef.current.push({
				x,
				y,
				vx: Math.cos(a) * sp,
				vy: Math.sin(a) * sp,
				life: 1,
				color
			});
		}
	};
	const endLevel = (0, import_react.useCallback)((pocketed, total, usedShots, wrongCount) => {
		const allDone = pocketed === total;
		let stars = 0;
		if (allDone && wrongCount === 0 && usedShots <= total + 1) stars = 3;
		else if (allDone) stars = 2;
		else if (pocketed >= Math.ceil(total / 2)) stars = 1;
		const xp = 40 + pocketed * 15 + stars * 20;
		finishSession({
			game: "carrom",
			level: world,
			stars,
			xp,
			world
		});
		setResult({
			stars,
			xp,
			title: stars === 3 ? "PERFECT WORLD!" : allDone ? "WORLD CLEARED!" : "GOOD TRY!",
			message: allDone ? `You pocketed all ${total} coins in ${usedShots} shots.` : `${pocketed} of ${total} coins pocketed. Every try makes you sharper!`
		});
		sfx.great();
	}, [finishSession, world]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		const collide = (a, ar, b, br, ma = 1, mb = 1) => {
			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const d = Math.hypot(dx, dy);
			if (d === 0 || d > ar + br) return false;
			const nx = dx / d;
			const ny = dy / d;
			const overlap = ar + br - d;
			a.x -= nx * overlap * mb / (ma + mb);
			a.y -= ny * overlap * mb / (ma + mb);
			b.x += nx * overlap * ma / (ma + mb);
			b.y += ny * overlap * ma / (ma + mb);
			const rvx = b.vx - a.vx;
			const rvy = b.vy - a.vy;
			const sep = rvx * nx + rvy * ny;
			if (sep > 0) return false;
			const imp = -1.86 * sep / (1 / ma + 1 / mb);
			a.vx -= imp * nx / ma;
			a.vy -= imp * ny / ma;
			b.vx += imp * nx / mb;
			b.vy += imp * ny / mb;
			return true;
		};
		const wall = (b, r) => {
			if (b.x - r < MIN) {
				b.x = MIN + r;
				b.vx = Math.abs(b.vx) * .86;
			}
			if (b.x + r > MAX) {
				b.x = MAX - r;
				b.vx = -Math.abs(b.vx) * .86;
			}
			if (b.y - r < MIN) {
				b.y = MIN + r;
				b.vy = Math.abs(b.vy) * .86;
			}
			if (b.y + r > MAX) {
				b.y = MAX - r;
				b.vy = -Math.abs(b.vy) * .86;
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
				if (Math.hypot(b.vx, b.vy) < .09) {
					b.vx = 0;
					b.vy = 0;
				} else moving = true;
			});
			coins.forEach((c) => {
				if (!c.done) {
					if (collide(striker, STRIKER_R, c, COIN_R, 1.7, 1)) sfx.hit();
				}
			});
			for (let i = 0; i < coins.length; i++) for (let j = i + 1; j < coins.length; j++) if (!coins[i].done && !coins[j].done) collide(coins[i], COIN_R, coins[j], COIN_R);
			wall(striker, STRIKER_R);
			coins.forEach((c) => {
				if (!c.done) wall(c, COIN_R);
			});
			coins.forEach((c) => {
				if (c.done) return;
				for (const p of POCKETS) if (Math.hypot(c.x - p.x, c.y - p.y) < POCKET_R) {
					c.done = true;
					const ok = matches(p.cat, c.n);
					glowRef.current[p.cat] = 1;
					burst(p.x, p.y, ok ? "#fbbf24" : "#94a3b8", ok ? 22 : 8);
					recordTopic(p.cat, ok);
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
			});
			partsRef.current = partsRef.current.map((p) => ({
				...p,
				x: p.x + p.vx,
				y: p.y + p.vy,
				vy: p.vy + .12,
				life: p.life - .024
			})).filter((p) => p.life > 0);
			Object.keys(glowRef.current).forEach((k) => {
				glowRef.current[k] = Math.max(0, glowRef.current[k] - .02);
			});
			if (movingRef.current && !moving) {
				movingRef.current = false;
				striker.vx = 0;
				striker.vy = 0;
				striker.y = 496;
				striker.x = Math.min(472, Math.max(128, striker.x));
				setStrikerX(striker.x);
			}
			movingRef.current = moving;
		};
		const predict = () => {
			const { dx, dy, power } = aimRef.current;
			const sim = {
				x: strikerRef.current.x,
				y: strikerRef.current.y,
				vx: dx * power * 21,
				vy: dy * power * 21
			};
			const pts = [{
				x: sim.x,
				y: sim.y
			}];
			const steps = assist === "beginner" ? 220 : assist === "normal" ? 110 : 42;
			let hit = null;
			for (let i = 0; i < steps; i++) {
				sim.x += sim.vx;
				sim.y += sim.vy;
				sim.vx *= FRICTION;
				sim.vy *= FRICTION;
				if (assist !== "expert") wall(sim, STRIKER_R);
				else if (sim.x - STRIKER_R < MIN || sim.x + STRIKER_R > MAX || sim.y - STRIKER_R < MIN || sim.y + STRIKER_R > MAX) break;
				const c = coinsRef.current.find((co) => !co.done && Math.hypot(co.x - sim.x, co.y - sim.y) < 39);
				if (c) {
					hit = {
						x: sim.x,
						y: sim.y,
						coin: c
					};
					break;
				}
				if (i % 4 === 0) pts.push({
					x: sim.x,
					y: sim.y
				});
				if (Math.hypot(sim.vx, sim.vy) < .4) break;
			}
			return {
				pts,
				hit
			};
		};
		const draw = () => {
			const wood = ctx.createLinearGradient(0, 0, S, S);
			wood.addColorStop(0, "#c78d४a".replace("४", "4"));
			wood.addColorStop(.5, "#a9682f");
			wood.addColorStop(1, "#8a5222");
			ctx.fillStyle = wood;
			ctx.beginPath();
			ctx.roundRect(0, 0, S, S, 34);
			ctx.fill();
			const bed = ctx.createRadialGradient(S / 2, S / 2 - 40, 60, S / 2, S / 2, 340);
			bed.addColorStop(0, "#fbe9c6");
			bed.addColorStop(1, "#e9c78d");
			ctx.fillStyle = bed;
			ctx.beginPath();
			ctx.roundRect(44, 44, 512, 512, 22);
			ctx.fill();
			ctx.strokeStyle = "rgba(120,72,30,0.35)";
			ctx.lineWidth = 4;
			ctx.stroke();
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
			ctx.strokeStyle = "rgba(120,72,30,0.4)";
			ctx.setLineDash([10, 8]);
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(118, 496);
			ctx.lineTo(482, 496);
			ctx.stroke();
			ctx.setLineDash([]);
			POCKETS.forEach((p) => {
				const g = glowRef.current[p.cat];
				ctx.save();
				ctx.beginPath();
				ctx.arc(p.x, p.y, 52 + g * 8, 0, Math.PI * 2);
				ctx.fillStyle = p.color + "33";
				ctx.fill();
				ctx.beginPath();
				ctx.arc(p.x, p.y, 38, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.globalAlpha = .9;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.beginPath();
				ctx.arc(p.x, p.y, 30, 0, Math.PI * 2);
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
			if (aimRef.current.dragging && !movingRef.current) {
				const { pts, hit } = predict();
				ctx.save();
				ctx.strokeStyle = "rgba(255,255,255,0.85)";
				ctx.lineWidth = 5;
				ctx.setLineDash([12, 10]);
				ctx.beginPath();
				pts.forEach((pt, i) => i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y));
				ctx.stroke();
				ctx.setLineDash([]);
				if (hit) {
					ctx.beginPath();
					ctx.arc(hit.coin.x, hit.coin.y, 25, 0, Math.PI * 2);
					ctx.strokeStyle = "rgba(251,191,36,0.95)";
					ctx.lineWidth = 5;
					ctx.stroke();
				}
				ctx.restore();
			}
			coinsRef.current.forEach((c) => {
				if (c.done) return;
				ctx.save();
				ctx.beginPath();
				ctx.ellipse(c.x, c.y + 5, COIN_R, COIN_R * .6, 0, 0, Math.PI * 2);
				ctx.fillStyle = "rgba(80,50,20,0.22)";
				ctx.fill();
				const g = ctx.createRadialGradient(c.x - 6, c.y - 8, 3, c.x, c.y, COIN_R);
				g.addColorStop(0, "#ffffff");
				g.addColorStop(.25, c.hue);
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
			const st = strikerRef.current;
			const scale = aimRef.current.dragging ? 1.12 : 1;
			ctx.save();
			ctx.beginPath();
			ctx.ellipse(st.x, st.y + 7, STRIKER_R, STRIKER_R * .6, 0, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(80,50,20,0.25)";
			ctx.fill();
			const sg = ctx.createRadialGradient(st.x - 8, st.y - 10, 4, st.x, st.y, STRIKER_R * scale);
			sg.addColorStop(0, "#ffffff");
			sg.addColorStop(.6, "#fde68a");
			sg.addColorStop(1, "#f59e0b");
			ctx.beginPath();
			ctx.arc(st.x, st.y, STRIKER_R * scale, 0, Math.PI * 2);
			ctx.fillStyle = sg;
			ctx.fill();
			ctx.lineWidth = 4;
			ctx.strokeStyle = "#ffffff";
			ctx.stroke();
			ctx.restore();
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
	}, [assist]);
	const toLogical = (e) => {
		const r = e.currentTarget.getBoundingClientRect();
		return {
			x: (e.clientX - r.left) / r.width * S,
			y: (e.clientY - r.top) / r.height * S
		};
	};
	const onDown = (e) => {
		if (movingRef.current || result || countdown !== null) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		aimRef.current.dragging = true;
		onMove(e);
	};
	const onMove = (e) => {
		if (!aimRef.current.dragging) return;
		const p = toLogical(e);
		const st = strikerRef.current;
		let dx = st.x - p.x;
		let dy = st.y - p.y;
		const d = Math.hypot(dx, dy) || 1;
		dx /= d;
		dy /= d;
		if (assist === "beginner") {
			let best = null;
			coinsRef.current.forEach((c) => {
				if (c.done) return;
				const target = POCKETS.find((pk) => matches(pk.cat, c.n));
				if (!target) return;
				const tx = c.x - (target.x - c.x) * .16 - st.x;
				const ty = c.y - (target.y - c.y) * .16 - st.y;
				const tl = Math.hypot(tx, ty) || 1;
				const ndx = tx / tl;
				const ndy = ty / tl;
				const diff = Math.acos(Math.max(-1, Math.min(1, ndx * dx + ndy * dy)));
				if (diff < .16 && (!best || diff < best.diff)) best = {
					dx: ndx,
					dy: ndy,
					diff
				};
			});
			if (best) {
				dx = dx * .35 + best.dx * .65;
				dy = dy * .35 + best.dy * .65;
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
		if (power < .08) return;
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
				if (coinsRef.current.filter((c) => c.done).length === total || next >= maxShots) {
					const w = coinsRef.current.filter((c) => c.done).length;
					endLevel(w, total, next, wrong);
				}
			}, 2600);
			return next;
		});
	};
	const nextWorld = () => {
		const nw = Math.min(5, world + 1);
		navigate({
			to: "/carrom",
			search: { world: nw }
		});
		reset(nw);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-2xl sm:text-3xl",
					children: ["🎯 Carrom Challenge — World ", world]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-muted-foreground",
					children: "Send each coin into the pocket that matches it: prime, even, odd or composite."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							icon: "🏅",
							value: score,
							label: "score"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							icon: "🔥",
							value: `x${combo}`,
							label: "combo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							icon: "🎯",
							value: `${shots}/${maxShots}`,
							label: "shots"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							icon: "🪙",
							value: left,
							label: "coins"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto w-full max-w-[600px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							width: S,
							height: S,
							onPointerDown: onDown,
							onPointerMove: onMove,
							onPointerUp: onUp,
							onPointerCancel: onUp,
							className: "w-full touch-none rounded-[2.2rem] shadow-[var(--shadow-pop)]",
							style: { aspectRatio: "1 / 1" }
						}),
						aimRef.current.dragging,
						flash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-x-0 top-6 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "animate-pop-in font-display rounded-full bg-card/95 px-5 py-2 text-xl shadow-[var(--shadow-toy)]",
								children: flash
							})
						}),
						countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { value: countdown }),
						result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultOverlay, {
							title: result.title,
							message: result.message,
							stars: result.stars,
							xp: result.xp,
							onReplay: () => reset(world),
							onNext: world < 5 ? nextWorld : void 0,
							backTo: "/map",
							backLabel: "🗺️ Map"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "font-display flex items-center gap-3 text-sm",
								children: ["Striker position", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 128,
									max: 472,
									value: strikerX,
									onChange: (e) => {
										const v = Number(e.target.value);
										setStrikerX(v);
										if (!movingRef.current) strikerRef.current.x = v;
									},
									className: "h-4 flex-1 accent-coral"
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "toy-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg",
									children: "🎚️ Aim helper"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid gap-2",
									children: [
										"beginner",
										"normal",
										"expert"
									].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sfx.click();
											setAssist(m);
										},
										className: cn("jelly font-display px-4 py-2.5 text-left text-base capitalize", assist === m ? "bg-gradient-play text-mint-foreground" : "bg-muted text-muted-foreground"),
										children: m === "beginner" ? "🐣 Beginner" : m === "normal" ? "🙂 Normal" : "🦅 Expert"
									}, m))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-bold text-muted-foreground",
									children: "Beginner shows the full path with rebounds and nudges your aim. You can do this!"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "toy-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg",
								children: "Pockets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-2 space-y-1 text-sm font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🔵 PRIME — 2, 3, 5, 7, 11…" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🟢 EVEN — 2, 4, 6, 8…" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🟠 ODD — 3, 5, 9, 15…" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🟣 COMPOSITE — 4, 6, 9, 25…" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							variant: "cream",
							className: "w-full",
							onClick: () => reset(world),
							children: "🔁 Restart world"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MascotBubble, {
				className: "mt-5",
				size: 92,
				mood: combo >= 3 ? "celebrate" : "happy",
				text: mascot
			})
		]
	});
}
//#endregion
export { CarromPage as component };
