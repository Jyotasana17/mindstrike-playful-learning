import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as sfx, f as StatChip, g as isPrime, h as isComposite, i as GameShell, n as Countdown, o as JellyButton, r as FloatingScore, s as LevelPath, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
import { t as Route } from "./target-strike-DhcIv7ui.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/target-strike-BcdRcbbt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = {
	prime: {
		label: "Prime Numbers",
		check: (v) => isPrime(parseInt(v)),
		gen: () => Math.floor(Math.random() * 50) + 2
	},
	composite: {
		label: "Composite Numbers",
		check: (v) => isComposite(parseInt(v)),
		gen: () => Math.floor(Math.random() * 50) + 4
	},
	even: {
		label: "Even Numbers",
		check: (v) => parseInt(v) % 2 === 0,
		gen: () => Math.floor(Math.random() * 100)
	},
	odd: {
		label: "Odd Numbers",
		check: (v) => parseInt(v) % 2 !== 0,
		gen: () => Math.floor(Math.random() * 100)
	},
	s_block: {
		label: "S-Block Elements",
		check: (v) => [
			"H",
			"Li",
			"Na",
			"K",
			"Be",
			"Mg",
			"Ca"
		].includes(v),
		gen: () => [
			"H",
			"He",
			"Li",
			"Be",
			"B",
			"C",
			"N",
			"O",
			"F",
			"Ne",
			"Na",
			"Mg",
			"Al",
			"Si",
			"P",
			"S",
			"Cl",
			"Ar",
			"K",
			"Ca"
		][Math.floor(Math.random() * 20)]
	}
};
var LEVELS = [
	{
		id: 1,
		category: "even",
		speed: 1,
		duration: 30,
		spawnRate: 800
	},
	{
		id: 2,
		category: "odd",
		speed: 1.2,
		duration: 30,
		spawnRate: 700
	},
	{
		id: 3,
		category: "prime",
		speed: 1.5,
		duration: 35,
		spawnRate: 600
	},
	{
		id: 4,
		category: "composite",
		speed: 1.8,
		duration: 35,
		spawnRate: 500
	},
	{
		id: 5,
		category: "s_block",
		speed: 2.2,
		duration: 40,
		spawnRate: 400
	}
];
function TargetStrike() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { player, finishSession, recordTopic } = usePlayer();
	const [level, setLevel] = (0, import_react.useState)(search.level ?? 1);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [countdown, setCountdown] = (0, import_react.useState)(null);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [bestCombo, setBestCombo] = (0, import_react.useState)(0);
	const [correctHits, setCorrectHits] = (0, import_react.useState)(0);
	const [wrongHits, setWrongHits] = (0, import_react.useState)(0);
	const [targets, setTargets] = (0, import_react.useState)([]);
	const [floating, setFloating] = (0, import_react.useState)([]);
	const reqRef = (0, import_react.useRef)();
	const lastTimeRef = (0, import_react.useRef)();
	const spawnTimerRef = (0, import_react.useRef)(0);
	const config = LEVELS[level - 1];
	const cat = CATEGORIES[config.category];
	(0, import_react.useEffect)(() => {
		if (search.level && search.level !== level) setLevel(search.level);
	}, [search.level]);
	const stateRef = (0, import_react.useRef)({
		targets,
		playing,
		timeLeft,
		score,
		combo,
		bestCombo,
		correctHits,
		wrongHits
	});
	(0, import_react.useEffect)(() => {
		stateRef.current = {
			targets,
			playing,
			timeLeft,
			score,
			combo,
			bestCombo,
			correctHits,
			wrongHits
		};
	}, [
		targets,
		playing,
		timeLeft,
		score,
		combo,
		bestCombo,
		correctHits,
		wrongHits
	]);
	const startGame = () => {
		setTargets([]);
		setScore(0);
		setCombo(0);
		setBestCombo(0);
		setCorrectHits(0);
		setWrongHits(0);
		setTimeLeft(config.duration);
		setFloating([]);
		setCountdown(3);
		let c = 3;
		const iv = setInterval(() => {
			c--;
			if (c > 0) setCountdown(c);
			else if (c === 0) setCountdown("GO!");
			else {
				clearInterval(iv);
				setCountdown(null);
				setPlaying(true);
			}
		}, 800);
	};
	const addScore = (pts, x, y, good) => {
		setScore((s) => Math.max(0, s + pts));
		if (good) {
			setCombo((c) => {
				const nc = c + 1;
				setBestCombo((bc) => Math.max(bc, nc));
				return nc;
			});
			setCorrectHits((h) => h + 1);
		} else {
			setCombo(0);
			setWrongHits((h) => h + 1);
		}
		const id = Date.now();
		setFloating((f) => [...f, {
			id,
			x,
			y,
			text: pts > 0 ? `+${pts}` : `${pts}`,
			good
		}]);
		setTimeout(() => setFloating((f) => f.filter((i) => i.id !== id)), 800);
	};
	const handleShoot = (t) => {
		if (!playing || !t.active) return;
		setTargets((cur) => cur.map((i) => i.id === t.id ? {
			...i,
			active: false
		} : i));
		if (t.isTarget) {
			sfx.play();
			addScore(15 + combo * 3, t.x, t.y, true);
			recordTopic(config.category, true, 800);
		} else {
			sfx.oops();
			addScore(-10, t.x, t.y, false);
			recordTopic(config.category, false, 800);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const loop = (time) => {
			if (!lastTimeRef.current) lastTimeRef.current = time;
			const dt = time - lastTimeRef.current;
			lastTimeRef.current = time;
			let nextTargets = stateRef.current.targets.map((t) => {
				let nx = t.x + t.vx * dt * .05 * config.speed;
				let ny = t.y + t.vy * dt * .05 * config.speed;
				let nvx = t.vx;
				let nvy = t.vy;
				if (nx < 5 || nx > 95) {
					nvx *= -1;
					nx = nx < 5 ? 5 : 95;
				}
				if (ny < 15 || ny > 90) {
					nvy *= -1;
					ny = ny < 15 ? 15 : 90;
				}
				return {
					...t,
					x: nx,
					y: ny,
					vx: nvx,
					vy: nvy
				};
			}).filter((t) => t.active);
			spawnTimerRef.current += dt;
			if (spawnTimerRef.current > config.spawnRate) {
				spawnTimerRef.current = 0;
				const forceTarget = Math.random() > .6;
				let val = "";
				do
					val = cat.gen().toString();
				while (forceTarget ? !cat.check(val) : cat.check(val));
				nextTargets.push({
					id: Date.now(),
					value: val,
					x: Math.random() > .5 ? 5 : 95,
					y: 20 + Math.random() * 60,
					vx: (Math.random() - .5) * 2,
					vy: (Math.random() - .5) * 2,
					isTarget: cat.check(val),
					active: true
				});
			}
			setTargets(nextTargets);
			reqRef.current = requestAnimationFrame(loop);
		};
		reqRef.current = requestAnimationFrame(loop);
		return () => {
			if (reqRef.current) cancelAnimationFrame(reqRef.current);
		};
	}, [
		playing,
		config,
		cat
	]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const iv = setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					setPlaying(false);
					const { score: finalScore, bestCombo, correctHits, wrongHits } = stateRef.current;
					const stars = finalScore > 200 ? 3 : finalScore > 100 ? 2 : finalScore > 40 ? 1 : 0;
					const xp = finalScore > 0 ? Math.floor(finalScore / 3) : 0;
					const totalHits = correctHits + wrongHits;
					const accuracy = totalHits > 0 ? Math.round(correctHits / totalHits * 100) : 0;
					finishSession({
						game: "target-strike",
						level,
						stars,
						xp
					});
					navigate({
						to: "/arcade/result",
						search: {
							game: "target-strike",
							level,
							score: finalScore,
							stars,
							xp,
							accuracy,
							combo: bestCombo,
							time: config.duration,
							details: JSON.stringify({
								"Correct Targets": correctHits,
								"Wrong Targets": wrongHits
							})
						}
					});
					return 0;
				}
				return t - 1;
			});
		}, 1e3);
		return () => clearInterval(iv);
	}, [
		playing,
		level,
		finishSession,
		navigate,
		config.duration
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		wide: true,
		title: "☄️ Target Strike",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelPath, {
				levels: 5,
				progress: player.mini["target-strike"],
				current: level,
				onPick: (l) => {
					setLevel(l);
					setPlaying(false);
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "toy-card relative h-[60vh] min-h-[400px] overflow-hidden bg-gradient-to-b from-sky to-mint/30 touch-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-4 left-4 right-4 flex justify-between z-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
						icon: "🎯",
						value: cat.label,
						className: playing ? "ring-2 ring-primary bg-primary/10" : ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
								icon: "🔥",
								value: `${combo}x`,
								className: combo > 3 ? "animate-pulse-glow" : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
								icon: "⏱️",
								value: `${timeLeft}s`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
								icon: "✨",
								value: score
							})
						]
					})]
				}),
				!playing && !countdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 z-30 flex items-center justify-center bg-foreground/10 backdrop-blur-[2px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(JellyButton, {
						variant: "primary",
						size: "lg",
						onClick: startGame,
						children: ["▶️ Start Level ", level]
					})
				}),
				countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { value: countdown }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingScore, { items: floating }),
				targets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onPointerDown: () => handleShoot(t),
					className: "absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-card border-4 border-muted text-foreground font-display text-xl drop-shadow-md transition-transform active:scale-75",
					style: {
						left: `${t.x}%`,
						top: `${t.y}%`
					},
					children: t.value
				}, t.id))
			]
		})]
	});
}
//#endregion
export { TargetStrike as component };
