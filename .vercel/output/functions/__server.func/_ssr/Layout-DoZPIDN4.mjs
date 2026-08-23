import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as Lock, t as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Layout-DoZPIDN4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var STORAGE_KEY = "mindstrike.player.v1";
var emptyTopics = () => ({
	prime: {
		correct: 0,
		total: 0,
		ms: 0
	},
	even: {
		correct: 0,
		total: 0,
		ms: 0
	},
	odd: {
		correct: 0,
		total: 0,
		ms: 0
	},
	composite: {
		correct: 0,
		total: 0,
		ms: 0
	},
	shapes: {
		correct: 0,
		total: 0,
		ms: 0
	},
	arithmetic: {
		correct: 0,
		total: 0,
		ms: 0
	},
	elements: {
		correct: 0,
		total: 0,
		ms: 0
	}
});
var defaultPlayer = () => ({
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
		carrom: {}
	},
	topics: emptyTopics(),
	badges: [],
	unlocked: ["board-classic", "striker-classic"]
});
var levelFromXp = (xp) => Math.max(1, Math.floor(xp / 250) + 1);
var xpIntoLevel = (xp) => xp % 250;
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var memory = null;
var listeners = /* @__PURE__ */ new Set();
function read() {
	if (memory) return memory;
	if (typeof window === "undefined") return defaultPlayer();
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		memory = raw ? {
			...defaultPlayer(),
			...JSON.parse(raw)
		} : defaultPlayer();
	} catch {
		memory = defaultPlayer();
	}
	return memory;
}
function write(next) {
	memory = next;
	if (typeof window !== "undefined") try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch {}
	listeners.forEach((l) => l());
}
function usePlayer() {
	const [player, setPlayer] = (0, import_react.useState)(defaultPlayer);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const sync = () => setPlayer({ ...read() });
		sync();
		setReady(true);
		listeners.add(sync);
		return () => listeners.delete(sync);
	}, []);
	const update = (0, import_react.useCallback)((fn) => {
		write(fn({ ...read() }));
	}, []);
	const addXp = (0, import_react.useCallback)((xp) => update((p) => ({
		...p,
		xp: p.xp + xp
	})), [update]);
	const recordTopic = (0, import_react.useCallback)((topic, correct, ms = 900) => update((p) => ({
		...p,
		topics: {
			...p.topics,
			[topic]: {
				correct: p.topics[topic].correct + (correct ? 1 : 0),
				total: p.topics[topic].total + 1,
				ms: p.topics[topic].ms + ms
			}
		}
	})), [update]);
	const finishSession = (0, import_react.useCallback)((opts) => update((p) => {
		const prevMini = p.mini[opts.game]?.[opts.level] ?? 0;
		const day = today();
		const yesterday = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 10);
		const streak = p.lastPlayDay === day ? p.streak : p.lastPlayDay === yesterday ? p.streak + 1 : 1;
		const gainedStars = Math.max(0, opts.stars - prevMini);
		const prevWorld = opts.world ? p.worlds[opts.world] ?? 0 : 0;
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
				[opts.game]: {
					...p.mini[opts.game],
					[opts.level]: Math.max(prevMini, opts.stars)
				}
			},
			worlds: opts.world ? {
				...p.worlds,
				[opts.world]: Math.max(prevWorld, opts.stars),
				...opts.stars > 0 ? { [opts.world + 1]: p.worlds[opts.world + 1] ?? 0 } : {}
			} : p.worlds
		};
	}), [update]);
	const completeDaily = (0, import_react.useCallback)(() => update((p) => ({
		...p,
		dailyDoneDay: today(),
		xp: p.xp + 100,
		coins: p.coins + 40,
		badges: p.badges.includes("daily-hero") ? p.badges : [...p.badges, "daily-hero"]
	})), [update]);
	const buy = (0, import_react.useCallback)((id, cost) => update((p) => p.unlocked.includes(id) || p.coins < cost ? p : {
		...p,
		coins: p.coins - cost,
		unlocked: [...p.unlocked, id]
	}), [update]);
	const reset = (0, import_react.useCallback)(() => write(defaultPlayer()), []);
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
		today: today()
	};
}
var topicLabels = {
	prime: "Prime Numbers",
	even: "Even Numbers",
	odd: "Odd Numbers",
	composite: "Composite Numbers",
	shapes: "Shapes & Vision",
	arithmetic: "Quick Arithmetic",
	elements: "Elements & Groups"
};
var topicGame = {
	prime: {
		game: "carrom",
		label: "Carrom Number Challenge",
		to: "/carrom"
	},
	even: {
		game: "carrom",
		label: "Carrom Number Challenge",
		to: "/carrom"
	},
	odd: {
		game: "carrom",
		label: "Carrom Number Challenge",
		to: "/carrom"
	},
	composite: {
		game: "target-strike",
		label: "Target Strike",
		to: "/arcade/target-strike"
	},
	shapes: {
		game: "shape-hunter",
		label: "Shape Hunter",
		to: "/arcade/shape-hunter"
	},
	arithmetic: {
		game: "number-catcher",
		label: "Number Catcher",
		to: "/arcade/number-catcher"
	},
	elements: {
		game: "target-strike",
		label: "Target Strike",
		to: "/arcade/target-strike"
	}
};
function topicAccuracy(t, fallback) {
	if (t.total < 3) return fallback;
	return Math.round(t.correct / t.total * 100);
}
/** Deterministic-ish baseline so a fresh profile still shows a friendly picture. */
var baselineAccuracy = {
	prime: 88,
	even: 79,
	odd: 64,
	composite: 71,
	shapes: 86,
	arithmetic: 74,
	elements: 68
};
var isPrime = (n) => {
	if (n < 2) return false;
	for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
	return true;
};
var isComposite = (n) => n > 1 && !isPrime(n);
var ctx = null;
function audio() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const Ctor = window.AudioContext ?? window.webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
	}
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
function tone(freq, dur, type = "sine", gain = .06, delay = 0) {
	const ac = audio();
	if (!ac) return;
	const osc = ac.createOscillator();
	const g = ac.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
	g.gain.setValueAtTime(0, ac.currentTime + delay);
	g.gain.linearRampToValueAtTime(gain, ac.currentTime + delay + .01);
	g.gain.exponentialRampToValueAtTime(1e-4, ac.currentTime + delay + dur);
	osc.connect(g).connect(ac.destination);
	osc.start(ac.currentTime + delay);
	osc.stop(ac.currentTime + delay + dur + .02);
}
var sfx = {
	tap: () => tone(660, .08, "triangle"),
	good: () => {
		tone(660, .12, "triangle");
		tone(880, .16, "triangle", .05, .08);
	},
	great: () => {
		[
			523,
			659,
			784,
			1046
		].forEach((f, i) => tone(f, .16, "triangle", .05, i * .07));
	},
	oops: () => tone(220, .18, "sawtooth", .035),
	click: () => tone(420, .05, "square", .03),
	hit: () => tone(180, .07, "square", .04),
	shoot: () => {
		tone(300, .1, "square", .05);
		tone(520, .08, "triangle", .04, .05);
	},
	pocket: () => {
		tone(784, .12, "sine", .06);
		tone(1175, .2, "sine", .05, .09);
	}
};
function Stars({ count, size = 20 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center gap-0.5",
		children: [
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
			size,
			strokeWidth: 2.5,
			className: cn("transition-transform", i < count ? "fill-sun text-sun-foreground animate-pop-in" : "fill-muted text-muted-foreground/50"),
			style: { animationDelay: `${i * 90}ms` }
		}, i))
	});
}
var variants = {
	sun: "bg-gradient-sun text-sun-foreground",
	play: "bg-gradient-play text-mint-foreground",
	grape: "bg-gradient-grape text-grape-foreground",
	coral: "bg-gradient-coral text-coral-foreground",
	primary: "bg-gradient-primary text-primary-foreground",
	cream: "bg-cream text-foreground"
};
function JellyButton({ children, variant = "primary", className, onClick, to, disabled, size = "md" }) {
	const cls = cn("jelly font-display inline-flex select-none items-center justify-center gap-2 text-center leading-none", variants[variant], size === "lg" ? "px-7 py-5 text-2xl" : size === "sm" ? "px-4 py-2.5 text-base" : "px-5 py-3.5 text-lg", disabled && "pointer-events-none opacity-50 grayscale", className);
	const handle = () => {
		sfx.click();
		onClick?.();
	};
	if (to) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: cls,
		onClick: handle,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cls,
		onClick: handle,
		disabled,
		children
	});
}
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("toy-card animate-rise p-5 sm:p-6", className),
		children
	});
}
function StatChip({ icon, value, label, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-1.5 rounded-full border-3 border-foreground/10 bg-card px-3 py-1.5 shadow-[var(--shadow-toy)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lg leading-none",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-base leading-none",
				children: value
			}),
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-bold text-muted-foreground",
				children: label
			})
		]
	});
}
/** Winding level path for a mini game. */
function LevelPath({ levels, progress, onPick, current }) {
	const highestDone = Object.entries(progress).reduce((acc, [k, v]) => v > 0 ? Math.max(acc, Number(k)) : acc, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap items-center justify-center gap-3 sm:gap-5",
		children: Array.from({ length: levels }, (_, i) => i + 1).map((lvl) => {
			const unlocked = lvl <= highestDone + 1;
			const stars = progress[lvl] ?? 0;
			const isChallenge = lvl === levels;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					if (!unlocked) {
						sfx.oops();
						return;
					}
					sfx.click();
					onPick(lvl);
				},
				className: cn("jelly relative flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border-4 sm:h-24 sm:w-24", unlocked ? isChallenge ? "bg-gradient-grape border-card text-grape-foreground" : "bg-gradient-sun border-card text-sun-foreground" : "border-card bg-locked text-card", lvl === current && "ring-6 ring-mint animate-pulse-glow", !unlocked && "hover:animate-wobble"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl leading-none",
					children: isChallenge ? "⭐" : unlocked ? lvl : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 22 })
				}), unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
					count: stars,
					size: 12
				})]
			}, lvl);
		})
	});
}
function FloatingScore({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: items.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("animate-float-up font-display pointer-events-none absolute z-30 text-2xl drop-shadow", f.good ? "text-mint-foreground" : "text-destructive"),
		style: {
			left: `${f.x}%`,
			top: `${f.y}%`
		},
		children: f.text
	}, f.id)) });
}
function ResultOverlay({ title, message, stars, xp, onReplay, onNext, backTo, backLabel = "Back" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-40 flex items-center justify-center bg-foreground/40 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-pop-in toy-card w-full max-w-sm p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl text-primary",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
						count: stars,
						size: 40
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base font-bold",
					children: message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display mt-1 text-2xl text-tangerine",
					children: [
						"+",
						xp,
						" XP"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap justify-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							variant: "play",
							onClick: onReplay,
							children: "🔁 Play again"
						}),
						onNext && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							variant: "sun",
							onClick: onNext,
							children: "➡️ Next level"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							variant: "cream",
							to: backTo,
							children: backLabel
						})
					]
				})
			]
		})
	});
}
function Countdown({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-40 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "animate-pop-in font-display text-7xl text-card text-stroke sm:text-8xl",
			children: value
		}, String(value))
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: "🏠"
	},
	{
		to: "/map",
		label: "Adventure",
		icon: "🗺️"
	},
	{
		to: "/carrom",
		label: "Carrom",
		icon: "🎯"
	},
	{
		to: "/arcade",
		label: "Mini Player",
		icon: "🎮"
	},
	{
		to: "/learning",
		label: "My Progress",
		icon: "🧠"
	},
	{
		to: "/profile",
		label: "Profile",
		icon: "👤"
	}
];
function SkyBackdrop() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-10 left-0 h-40 w-40 rounded-full bg-card/70 blur-[2px] animate-drift" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-24 left-0 h-24 w-56 rounded-full bg-card/60 animate-drift-slow" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-64 left-0 h-20 w-40 rounded-full bg-card/50 animate-drift",
				style: { animationDelay: "-20s" }
			}),
			[...Array(14)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "animate-twinkle absolute text-sun",
				style: {
					left: `${i * 37 % 96}%`,
					top: `${i * 53 % 90}%`,
					animationDelay: `${i * .4}s`,
					fontSize: `${10 + i % 3 * 6}px`
				},
				children: "✦"
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -left-10 h-64 w-[60vw] rounded-[50%] bg-mint/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-28 right-0 h-64 w-[55vw] rounded-[50%] bg-mint/40" })
		]
	});
}
function AnimatedNumber({ value }) {
	const [shown, setShown] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
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
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: shown });
}
function HUD() {
	const { player, level } = usePlayer();
	const pct = Math.round(xpIntoLevel(player.xp) / 250 * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/profile",
				className: "jelly flex items-center gap-2 rounded-full border-3 border-foreground/10 bg-card py-1.5 pr-4 pl-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-gradient-sun flex h-9 w-9 items-center justify-center rounded-full text-xl",
					children: player.avatar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-left leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display block text-sm",
						children: ["Lv ", level]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-1.5 w-16 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-gradient-play block h-full transition-all duration-700",
							style: { width: `${pct}%` }
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
				icon: "✨",
				value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: player.xp }),
				label: "XP"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
				icon: "⭐",
				value: player.stars
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
				icon: "🔥",
				value: player.streak
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
				icon: "🪙",
				value: player.coins,
				className: "hidden sm:flex"
			})
		]
	});
}
function BottomNav() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "sticky bottom-3 z-30 mx-auto mt-8 w-fit max-w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex items-center gap-1 overflow-x-auto rounded-full border-3 border-foreground/10 bg-card/95 p-2 shadow-[var(--shadow-toy)]",
			children: NAV.map((n) => {
				const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: n.to,
					className: cn("jelly flex min-w-16 flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-center", active ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl leading-none",
						children: n.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-[11px] leading-none",
						children: n.label
					})]
				}) }, n.to);
			})
		})
	});
}
function GameShell({ children, title, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyBackdrop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "font-display text-2xl text-primary sm:text-3xl",
					children: ["Mind", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-coral",
						children: "Strike"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: cn("mx-auto px-4 pt-4", wide ? "max-w-6xl" : "max-w-5xl"),
				children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "animate-rise font-display mb-4 text-3xl sm:text-4xl",
					children: title
				}), children]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
//#endregion
export { sfx as _, HUD as a, topicLabels as b, Panel as c, Stars as d, StatChip as f, isPrime as g, isComposite as h, GameShell as i, ResultOverlay as l, cn as m, Countdown as n, JellyButton as o, baselineAccuracy as p, FloatingScore as r, LevelPath as s, BottomNav as t, SkyBackdrop as u, topicAccuracy as v, usePlayer as x, topicGame as y };
