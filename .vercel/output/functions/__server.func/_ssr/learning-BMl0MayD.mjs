import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as topicLabels, i as GameShell, o as JellyButton, p as baselineAccuracy, v as topicAccuracy, x as usePlayer, y as topicGame } from "./Layout-DoZPIDN4.mjs";
import { n as MascotBubble } from "./Mascot-DVIeqxcP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learning-BMl0MayD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LearningPage() {
	const { player, level } = usePlayer();
	const [analyzing, setAnalyzing] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setAnalyzing(false), 2e3);
		return () => clearTimeout(t);
	}, []);
	const sorted = [...Object.entries(player.topics).map(([key, data]) => {
		return {
			key,
			acc: topicAccuracy(data, baselineAccuracy[key]),
			total: data.total
		};
	})].sort((a, b) => b.acc - a.acc);
	const strongest = sorted[0];
	const weakest = sorted[sorted.length - 1];
	const recGame = topicGame[weakest.key];
	let insight = `You've been playing well! You're ready for more challenges.`;
	if (player.gamesPlayed > 0) if (strongest.acc > 80 && weakest.acc > 70) insight = `You are incredibly consistent across all subjects! Your ${topicLabels[strongest.key]} accuracy is a stellar ${strongest.acc}%. You're ready for Advanced difficulty in Carrom.`;
	else if (strongest.acc - weakest.acc > 20) insight = `You're extremely strong with ${topicLabels[strongest.key]} (${strongest.acc}%). However, I noticed you hesitate more with ${topicLabels[weakest.key]} (${weakest.acc}%). Let's reinforce that distinction!`;
	else if (weakest.acc < 60) insight = `Your overall progress is good, but ${topicLabels[weakest.key]} is slowing you down. A few quick practice rounds will boost your confidence!`;
	else insight = `You're improving steadily! Your ${topicLabels[strongest.key]} skills are growing fast.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		wide: true,
		title: "🧠 AI Analysis",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-2 mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "toy-card p-6 flex flex-col items-center text-center relative overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-mint/20 to-sky/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10 w-full",
						children: analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 flex flex-col items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-16 border-8 border-t-primary border-r-mint border-b-sun border-l-coral rounded-full animate-spin mb-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl text-primary animate-pulse",
									children: "Analyzing your gameplay..."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground font-bold mt-2",
									children: "Connecting to Striko's neural net..."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-pop-in",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-primary mb-4",
								children: "YOUR LEARNING INSIGHT"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MascotBubble, {
								mood: "happy",
								size: 100,
								text: insight,
								className: "w-full text-left bg-background/80 backdrop-blur"
							})]
						})
					})]
				}), !analyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "toy-card p-6 animate-rise",
					style: { animationDelay: "200ms" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl mb-3 text-coral",
							children: "Recommended Action"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-bold text-muted-foreground mb-4",
							children: [
								"Based on your recent gameplay, Striko suggests playing ",
								recGame.label,
								" to improve your ",
								topicLabels[weakest.key],
								" accuracy."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(JellyButton, {
							to: recGame.to,
							variant: "coral",
							className: "w-full",
							children: ["Play ", recGame.label]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toy-card p-6 h-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl mb-6",
					children: "Subject Mastery"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-5",
					children: sorted.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: topicLabels[t.key] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: t.acc > 80 ? "text-mint-foreground" : t.acc < 60 ? "text-destructive" : "text-primary",
								children: [t.acc, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-3 w-full bg-muted rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full rounded-full transition-all duration-1000 ${t.acc > 80 ? "bg-gradient-play" : t.acc < 60 ? "bg-destructive/80" : "bg-gradient-sun"}`,
								style: {
									width: analyzing ? "0%" : `${t.acc}%`,
									transitionDelay: `${i * 100}ms`
								}
							})
						})]
					}, t.key))
				})]
			})]
		})
	});
}
//#endregion
export { LearningPage as component };
