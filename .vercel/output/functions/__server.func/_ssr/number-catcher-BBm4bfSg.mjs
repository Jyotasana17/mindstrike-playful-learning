import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as sfx, f as StatChip, i as GameShell, n as Countdown, o as JellyButton, r as FloatingScore, s as LevelPath, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
import { t as Route } from "./number-catcher-S1lhASfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/number-catcher-BBm4bfSg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LEVELS = [
	{
		id: 1,
		ops: ["+"],
		maxNum: 10,
		targetRange: [5, 20],
		speed: .3,
		duration: 45
	},
	{
		id: 2,
		ops: ["+", "-"],
		maxNum: 20,
		targetRange: [1, 30],
		speed: .5,
		duration: 45
	},
	{
		id: 3,
		ops: ["*", "+"],
		maxNum: 10,
		targetRange: [10, 50],
		speed: .7,
		duration: 45
	},
	{
		id: 4,
		ops: [
			"*",
			"+",
			"-"
		],
		maxNum: 15,
		targetRange: [10, 80],
		speed: .9,
		duration: 40
	},
	{
		id: 5,
		ops: [
			"*",
			"+",
			"-"
		],
		maxNum: 20,
		targetRange: [20, 100],
		speed: 1.2,
		duration: 30
	}
];
function NumberCatcher() {
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
	const [correctEqs, setCorrectEqs] = (0, import_react.useState)(0);
	const [wrongEqs, setWrongEqs] = (0, import_react.useState)(0);
	const [target, setTarget] = (0, import_react.useState)(0);
	const [equation, setEquation] = (0, import_react.useState)([]);
	const [lastEq, setLastEq] = (0, import_react.useState)("");
	const [items, setItems] = (0, import_react.useState)([]);
	const [floating, setFloating] = (0, import_react.useState)([]);
	const [bucketX, setBucketX] = (0, import_react.useState)(50);
	const reqRef = (0, import_react.useRef)();
	const lastTimeRef = (0, import_react.useRef)();
	const spawnTimerRef = (0, import_react.useRef)(0);
	const containerRef = (0, import_react.useRef)(null);
	const config = LEVELS[level - 1];
	(0, import_react.useEffect)(() => {
		if (search.level && search.level !== level) setLevel(search.level);
	}, [search.level]);
	const stateRef = (0, import_react.useRef)({
		items,
		playing,
		timeLeft,
		score,
		combo,
		bestCombo,
		correctEqs,
		wrongEqs,
		target,
		equation,
		bucketX
	});
	(0, import_react.useEffect)(() => {
		stateRef.current = {
			items,
			playing,
			timeLeft,
			score,
			combo,
			bestCombo,
			correctEqs,
			wrongEqs,
			target,
			equation,
			bucketX
		};
	}, [
		items,
		playing,
		timeLeft,
		score,
		combo,
		bestCombo,
		correctEqs,
		wrongEqs,
		target,
		equation,
		bucketX
	]);
	const generateTarget = () => {
		setTarget(Math.floor(Math.random() * (config.targetRange[1] - config.targetRange[0])) + config.targetRange[0]);
		setEquation([]);
	};
	const startGame = () => {
		setItems([]);
		setScore(0);
		setCombo(0);
		setBestCombo(0);
		setCorrectEqs(0);
		setWrongEqs(0);
		setLastEq("");
		setTimeLeft(config.duration);
		setFloating([]);
		generateTarget();
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
			setCorrectEqs((h) => h + 1);
		} else {
			setCombo(0);
			setWrongEqs((h) => h + 1);
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
	const evaluateEquation = (eq) => {
		try {
			let res = parseInt(eq[0]);
			for (let i = 1; i < eq.length; i += 2) {
				const op = eq[i];
				const num = parseInt(eq[i + 1]);
				if (isNaN(num)) break;
				if (op === "+") res += num;
				if (op === "-") res -= num;
				if (op === "*") res *= num;
			}
			return res;
		} catch {
			return null;
		}
	};
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const loop = (time) => {
			if (!lastTimeRef.current) lastTimeRef.current = time;
			const dt = time - lastTimeRef.current;
			lastTimeRef.current = time;
			const st = stateRef.current;
			let nextItems = st.items.map((i) => ({
				...i,
				y: i.y + config.speed * dt * .1
			}));
			const bucketY = 90;
			nextItems = nextItems.filter((item) => {
				if (item.y > 100) return false;
				if (item.y > bucketY && item.y < 95 && Math.abs(item.x - st.bucketX) < 10) {
					const lastIsOp = st.equation.length > 0 && isNaN(parseInt(st.equation[st.equation.length - 1]));
					const itemIsOp = isNaN(parseInt(item.value));
					if (st.equation.length === 0 && itemIsOp) sfx.oops();
					else if (lastIsOp && itemIsOp) sfx.oops();
					else if (!lastIsOp && !itemIsOp && st.equation.length > 0) sfx.oops();
					else {
						const newEq = [...st.equation, item.value];
						setEquation(newEq);
						sfx.click();
						if (!itemIsOp) {
							const val = evaluateEquation(newEq);
							if (val === st.target) {
								sfx.play();
								addScore(50 + st.combo * 5, st.bucketX, bucketY, true);
								recordTopic("arithmetic", true, 2e3);
								setLastEq(`${newEq.join(" ")} = ${st.target}`);
								generateTarget();
							} else if (val !== null && val > st.target) {
								sfx.oops();
								addScore(-10, st.bucketX, bucketY, false);
								setLastEq(`${newEq.join(" ")} = ${val} (Overshot)`);
								setEquation([]);
							}
						}
					}
					return false;
				}
				return true;
			});
			spawnTimerRef.current += dt;
			if (spawnTimerRef.current > 1200 / config.speed) {
				spawnTimerRef.current = 0;
				const value = Math.random() > .6 ? config.ops[Math.floor(Math.random() * config.ops.length)] : Math.floor(Math.random() * config.maxNum + 1).toString();
				nextItems.push({
					id: Date.now(),
					value,
					x: 10 + Math.random() * 80,
					y: -10,
					speed: config.speed * (.8 + Math.random() * .4)
				});
			}
			setItems(nextItems);
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
					const { score: finalScore, bestCombo, correctEqs, wrongEqs } = stateRef.current;
					const stars = finalScore > 150 ? 3 : finalScore > 80 ? 2 : finalScore > 30 ? 1 : 0;
					const xp = finalScore > 0 ? Math.floor(finalScore / 2) : 0;
					const totalEqs = correctEqs + wrongEqs;
					const accuracy = totalEqs > 0 ? Math.round(correctEqs / totalEqs * 100) : 0;
					finishSession({
						game: "number-catcher",
						level,
						stars,
						xp
					});
					navigate({
						to: "/arcade/result",
						search: {
							game: "number-catcher",
							level,
							score: finalScore,
							stars,
							xp,
							accuracy,
							combo: bestCombo,
							time: config.duration,
							details: {
								"Solved": correctEqs,
								"Wrong Attempts": wrongEqs,
								"Last Equation": lastEq || "None"
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
		config.duration,
		lastEq
	]);
	const handlePointerMove = (e) => {
		if (!playing || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width * 100;
		setBucketX(Math.max(5, Math.min(95, x)));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		wide: true,
		title: "🪣 Number Catcher",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelPath, {
				levels: 5,
				progress: player.mini["number-catcher"],
				current: level,
				onPick: (l) => {
					setLevel(l);
					setPlaying(false);
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: containerRef,
			className: "toy-card relative h-[60vh] min-h-[400px] overflow-hidden bg-gradient-to-b from-sky to-mint/30 touch-none",
			onPointerMove: handlePointerMove,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-4 left-4 right-4 flex justify-between z-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
						icon: "🎯",
						value: target,
						label: "Target",
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
						variant: "play",
						size: "lg",
						onClick: startGame,
						children: ["▶️ Start Level ", level]
					})
				}),
				countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { value: countdown }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingScore, { items: floating }),
				items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-xl border-4 ${isNaN(parseInt(s.value)) ? "bg-sun text-sun-foreground border-sun" : "bg-card text-foreground border-card"} font-display text-2xl drop-shadow-md`,
					style: {
						left: `${s.x}%`,
						top: `${s.y}%`
					},
					children: s.value
				}, s.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-4 transform -translate-x-1/2 z-20",
					style: {
						left: `${bucketX}%`,
						transition: "left 0.05s linear"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-foreground/80 text-background px-4 py-2 rounded-xl font-display text-2xl min-w-[80px] text-center border-4 border-foreground/90 shadow-[0_4px_0_rgba(0,0,0,0.2)]",
							children: equation.length === 0 ? "..." : equation.join(" ")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl mt-1",
							children: "🪣"
						})]
					})
				})
			]
		})]
	});
}
//#endregion
export { NumberCatcher as component };
