import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as sfx, d as Stars, f as StatChip, i as GameShell, o as JellyButton, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
import { n as MascotBubble } from "./Mascot-DVIeqxcP.mjs";
import { t as Route } from "./result-DSFdigTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/result-C5O6DQYz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GAME_INFO = {
	"shape-hunter": {
		title: "SHAPE HUNTER",
		route: "/arcade/shape-hunter",
		maxLevel: 5
	},
	"number-catcher": {
		title: "NUMBER CATCHER",
		route: "/arcade/number-catcher",
		maxLevel: 5
	},
	"target-strike": {
		title: "TARGET STRIKE",
		route: "/arcade/target-strike",
		maxLevel: 5
	}
};
function ResultPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { player } = usePlayer();
	const [animState, setAnimState] = (0, import_react.useState)("enter");
	const [dispScore, setDispScore] = (0, import_react.useState)(0);
	const [dispXp, setDispXp] = (0, import_react.useState)(0);
	const info = GAME_INFO[search.game];
	const isMaxLevel = search.level >= info.maxLevel;
	const isWin = search.stars > 0;
	(0, import_react.useEffect)(() => {
		sfx.cheer();
		const t1 = setTimeout(() => setAnimState("stars"), 800);
		const t2 = setTimeout(() => {
			setAnimState("score");
			let start = 0;
			const step = Math.max(1, Math.floor(search.score / 20));
			const iv = setInterval(() => {
				start += step;
				if (start >= search.score) {
					setDispScore(search.score);
					clearInterval(iv);
				} else setDispScore(start);
			}, 30);
		}, 1400);
		const t3 = setTimeout(() => {
			setAnimState("xp");
			let start = 0;
			const step = Math.max(1, Math.floor(search.xp / 20));
			const iv = setInterval(() => {
				start += step;
				if (start >= search.xp) {
					setDispXp(search.xp);
					clearInterval(iv);
				} else setDispXp(start);
			}, 30);
		}, 2e3);
		const t4 = setTimeout(() => setAnimState("done"), 2500);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
		};
	}, [search.score, search.xp]);
	let insight = "🌟 Great job! Keep going!";
	if (search.stars === 3) insight = "🔥 AMAZING! You're on fire!";
	else if (search.stars === 0) insight = "💪 Nice try! One more round?";
	if (search.accuracy !== void 0) {
		if (search.accuracy > 90) insight = "🧠 Quick Insight: Your accuracy was nearly perfect! Try increasing your speed.";
		else if (search.accuracy < 60) insight = "🧠 Quick Insight: Take your time. Accuracy is more important than speed!";
	}
	const detailsObj = search.details || {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		wide: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center min-h-[70vh] py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center animate-pop-in mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl sm:text-5xl text-primary mb-2",
						children: isWin ? "🎉 LEVEL COMPLETE!" : "TIME'S UP!"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-bold text-muted-foreground uppercase tracking-widest",
						children: [
							info.title,
							" - LEVEL ",
							search.level
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "toy-card w-full max-w-lg p-6 sm:p-8 flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-card to-muted/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-16 mb-4 flex items-center justify-center",
							children: animState !== "enter" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
								count: search.stars,
								size: 48
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 w-full mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-background rounded-xl p-4 text-center shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground mb-1",
									children: "SCORE"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-3xl text-primary",
									children: animState === "enter" || animState === "stars" ? 0 : dispScore
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-background rounded-xl p-4 text-center shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground mb-1",
									children: "XP EARNED"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display text-3xl text-tangerine",
									children: ["+", animState === "done" ? search.xp : dispXp]
								})]
							})]
						}),
						animState === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full bg-primary/5 rounded-xl p-4 mb-6 animate-rise flex flex-wrap gap-3 justify-center",
							children: [
								search.accuracy !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
									icon: "🎯",
									value: `${search.accuracy}%`,
									label: "Accuracy"
								}),
								search.combo !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
									icon: "🔥",
									value: `${search.combo}x`,
									label: "Best Combo"
								}),
								search.time !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
									icon: "⏱️",
									value: `${search.time}s`,
									label: "Time"
								}),
								Object.entries(detailsObj).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
									icon: "✨",
									value: String(v),
									label: k.toUpperCase()
								}, k))
							]
						}),
						animState === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full animate-rise",
							style: { animationDelay: "200ms" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MascotBubble, {
								size: 80,
								text: insight,
								mood: search.stars > 1 ? "celebrate" : "happy"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-lg transition-opacity duration-500",
					style: {
						opacity: animState === "done" ? 1 : 0,
						pointerEvents: animState === "done" ? "auto" : "none"
					},
					children: [
						isWin && (isMaxLevel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full bg-sun text-sun-foreground p-4 rounded-xl text-center font-display text-xl animate-pulse",
							children: "🏆 MINI PLAYER MASTER!"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							variant: "primary",
							className: "flex-1",
							onClick: () => navigate({ to: info.route }),
							children: "▶️ NEXT LEVEL"
						})),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							variant: "cream",
							className: "flex-1",
							onClick: () => navigate({
								to: info.route,
								search: { level: search.level }
							}),
							children: "🔄 PLAY AGAIN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							variant: "grape",
							className: "flex-1",
							to: "/arcade",
							children: "🎮 ARCADE"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ResultPage as component };
