import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as HUD, c as Panel, o as JellyButton, t as BottomNav, u as SkyBackdrop, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
import { t as Mascot } from "./Mascot-DVIeqxcP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CKQvL-HN.js
var import_jsx_runtime = require_jsx_runtime();
var ACTIONS = [
	{
		to: "/carrom",
		icon: "🎮",
		label: "Play",
		sub: "Carrom challenge",
		variant: "play"
	},
	{
		to: "/map",
		icon: "🗺️",
		label: "Adventure Map",
		sub: "5 worlds",
		variant: "sun"
	},
	{
		to: "/arcade",
		icon: "🎯",
		label: "Mini Player",
		sub: "3 arcade games",
		variant: "grape"
	},
	{
		to: "/learning",
		icon: "🧠",
		label: "My Progress",
		sub: "AI coach",
		variant: "primary"
	}
];
function Home() {
	const { player, ready, today } = usePlayer();
	const returning = player.gamesPlayed > 0;
	const dailyDone = player.dailyDoneDay === today;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyBackdrop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-display text-2xl text-primary sm:text-3xl",
					children: ["Mind", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-coral",
						children: "Strike"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-rise",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display text-5xl leading-[0.95] sm:text-6xl",
									children: ["Mind", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-coral",
										children: "Strike"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display mt-2 text-2xl text-primary sm:text-3xl",
									children: "Play. Think. Learn."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-md text-base font-bold text-muted-foreground",
									children: "A game world where every shot, catch and tap makes you smarter."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
										to: "/carrom",
										variant: "play",
										size: "lg",
										children: "🎮 Play"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
										to: "/daily",
										variant: "coral",
										size: "lg",
										className: dailyDone ? "" : "animate-pulse-glow",
										children: "🔥 Daily Challenge"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mascot, {
								mood: returning ? "wave" : "happy",
								size: 190
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "animate-pop-in toy-card mb-8 max-w-56 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg",
									children: ready && returning ? "Welcome back! Ready for today's challenge? 🚀" : "Hey! Ready for today's challenge? 🚀"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs font-bold text-muted-foreground",
									children: "— Striko"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: ACTIONS.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: a.to,
							className: "lift toy-card animate-rise flex flex-col items-start gap-1 p-5",
							style: { animationDelay: `${i * 70}ms` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-4xl",
									children: a.icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl",
									children: a.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-muted-foreground",
									children: a.sub
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `jelly mt-3 rounded-full px-4 py-2 font-display text-sm ${a.variant === "play" ? "bg-gradient-play text-mint-foreground" : a.variant === "sun" ? "bg-gradient-sun text-sun-foreground" : a.variant === "grape" ? "bg-gradient-grape text-grape-foreground" : "bg-gradient-primary text-primary-foreground"}`,
									children: "Let's go →"
								})
							]
						}, a.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								className: "bg-gradient-sun",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-xl",
									children: [
										"🔥 ",
										player.streak,
										"-day streak"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-bold",
									children: "Play one game today to keep it alive!"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-xl",
									children: [
										"⭐ ",
										player.stars,
										" stars collected"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-bold text-muted-foreground",
									children: "Stars unlock new boards and skins."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
									to: "/rewards",
									variant: "cream",
									size: "sm",
									className: "mt-3",
									children: "🎁 Rewards"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-xl",
									children: [
										"🎮 ",
										player.gamesPlayed,
										" games played"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-bold text-muted-foreground",
									children: "Striko is watching your skills grow."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
									to: "/learning",
									variant: "cream",
									size: "sm",
									className: "mt-3",
									children: "🧠 See my journey"
								})
							] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
//#endregion
export { Home as component };
