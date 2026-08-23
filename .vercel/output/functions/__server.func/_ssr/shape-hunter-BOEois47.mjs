import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as sfx, f as StatChip, i as GameShell, n as Countdown, o as JellyButton, r as FloatingScore, s as LevelPath, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
import { t as Route } from "./shape-hunter-DgS_1_9T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shape-hunter-BOEois47.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SHAPES = {
	triangle: "🔺",
	circle: "🟢",
	square: "🟦",
	star: "⭐"
};
var LEVELS = [
	{
		id: 1,
		target: "triangle",
		speed: .3,
		duration: 30,
		types: ["triangle", "circle"],
		total: 20
	},
	{
		id: 2,
		target: "circle",
		speed: .5,
		duration: 30,
		types: [
			"triangle",
			"circle",
			"square"
		],
		total: 30
	},
	{
		id: 3,
		target: "square",
		speed: .7,
		duration: 30,
		types: [
			"triangle",
			"circle",
			"square"
		],
		total: 40
	},
	{
		id: 4,
		target: "star",
		speed: .9,
		duration: 30,
		types: [
			"triangle",
			"circle",
			"square",
			"star"
		],
		total: 50
	},
	{
		id: 5,
		target: "triangle",
		speed: 1.2,
		duration: 25,
		types: [
			"triangle",
			"circle",
			"square",
			"star"
		],
		total: 60
	}
];
function ShapeHunter() {
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
	const [shapes, setShapes] = (0, import_react.useState)([]);
	const [floating, setFloating] = (0, import_react.useState)([]);
	const reqRef = (0, import_react.useRef)();
	const lastTimeRef = (0, import_react.useRef)();
	const spawnTimerRef = (0, import_react.useRef)(0);
	const stateRef = (0, import_react.useRef)({
		shapes,
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
			shapes,
			playing,
			timeLeft,
			score,
			combo,
			bestCombo,
			correctHits,
			wrongHits
		};
	}, [
		shapes,
		playing,
		timeLeft,
		score,
		combo,
		bestCombo,
		correctHits,
		wrongHits
	]);
	(0, import_react.useEffect)(() => {
		if (search.level && search.level !== level) setLevel(search.level);
	}, [search.level]);
	const config = LEVELS[level - 1];
	const startGame = () => {
		setShapes([]);
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
	const handleTap = (s) => {
		if (!playing || s.clicked) return;
		setShapes((cur) => cur.map((i) => i.id === s.id ? {
			...i,
			clicked: true
		} : i));
		if (s.type === config.target) {
			sfx.play();
			addScore(10 + combo * 2, s.x, s.y, true);
			recordTopic("shapes", true, 500);
		} else {
			sfx.oops();
			addScore(-5, s.x, s.y, false);
			recordTopic("shapes", false, 500);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const loop = (time) => {
			if (!lastTimeRef.current) lastTimeRef.current = time;
			const dt = time - lastTimeRef.current;
			lastTimeRef.current = time;
			const { shapes: currentShapes } = stateRef.current;
			let nextShapes = currentShapes.map((s) => ({
				...s,
				y: s.y + s.speed * dt * .1
			})).filter((s) => s.y < 110 && !s.clicked);
			spawnTimerRef.current += dt;
			if (spawnTimerRef.current > 800 / config.speed) {
				spawnTimerRef.current = 0;
				nextShapes.push({
					id: Date.now(),
					type: config.types[Math.floor(Math.random() * config.types.length)],
					x: 10 + Math.random() * 80,
					y: -10,
					speed: config.speed * (.8 + Math.random() * .4),
					clicked: false
				});
			}
			setShapes(nextShapes);
			reqRef.current = requestAnimationFrame(loop);
		};
		reqRef.current = requestAnimationFrame(loop);
		return () => {
			if (reqRef.current) cancelAnimationFrame(reqRef.current);
		};
	}, [playing, config]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const iv = setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					setPlaying(false);
					const { score: finalScore, bestCombo, correctHits, wrongHits } = stateRef.current;
					const stars = finalScore > 150 ? 3 : finalScore > 80 ? 2 : finalScore > 30 ? 1 : 0;
					const xp = finalScore > 0 ? Math.floor(finalScore / 2) : 0;
					const totalHits = correctHits + wrongHits;
					const accuracy = totalHits > 0 ? Math.round(correctHits / totalHits * 100) : 0;
					finishSession({
						game: "shape-hunter",
						level,
						stars,
						xp
					});
					navigate({
						to: "/arcade/result",
						search: {
							game: "shape-hunter",
							level,
							score: finalScore,
							stars,
							xp,
							accuracy,
							combo: bestCombo,
							time: config.duration,
							details: {
								"Correct Shapes": correctHits,
								"Wrong Shapes": wrongHits,
								"Max Combo": bestCombo
							}
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
		title: "🔺 Shape Hunter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelPath, {
				levels: 5,
				progress: player.mini["shape-hunter"],
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
						value: SHAPES[config.target],
						label: "Target"
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
						variant: "sun",
						size: "lg",
						onClick: startGame,
						children: ["▶️ Start Level ", level]
					})
				}),
				countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { value: countdown }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingScore, { items: floating }),
				shapes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "absolute transform -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl filter drop-shadow-md transition-transform active:scale-90",
					style: {
						left: `${s.x}%`,
						top: `${s.y}%`
					},
					onPointerDown: () => handleTap(s),
					children: SHAPES[s.type]
				}, s.id))
			]
		})]
	});
}
//#endregion
export { ShapeHunter as component };
