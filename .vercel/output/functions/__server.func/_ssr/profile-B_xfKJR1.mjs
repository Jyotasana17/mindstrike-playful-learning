import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as GameShell, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-B_xfKJR1.js
var import_jsx_runtime = require_jsx_runtime();
var DUMMY_PLAYERS = [
	{
		name: "Aarav",
		xp: 8920,
		avatar: "🦁"
	},
	{
		name: "Anaya",
		xp: 8450,
		avatar: "🐰"
	},
	{
		name: "Riya",
		xp: 7980,
		avatar: "🐼"
	},
	{
		name: "Kabir",
		xp: 6500,
		avatar: "🐯"
	},
	{
		name: "Zara",
		xp: 5200,
		avatar: "🦊"
	}
];
function ProfilePage() {
	const { player, level } = usePlayer();
	const leaderboard = [...DUMMY_PLAYERS, {
		name: player.name,
		xp: player.xp,
		avatar: player.avatar,
		isMe: true
	}].sort((a, b) => b.xp - a.xp);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		wide: true,
		title: "👤 Player Profile",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-2 mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toy-card p-6 flex flex-col items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-6xl bg-gradient-sun w-24 h-24 flex items-center justify-center rounded-full mb-4 shadow-sm",
						children: player.avatar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: player.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground font-bold mb-4",
						children: ["Level ", level]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 mt-4 w-full justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center p-3 bg-muted/50 rounded-xl min-w-[80px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl mb-1",
										children: "✨"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: player.xp
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-bold uppercase",
										children: "XP"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center p-3 bg-muted/50 rounded-xl min-w-[80px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl mb-1",
										children: "⭐"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: player.stars
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-bold uppercase",
										children: "Stars"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center p-3 bg-muted/50 rounded-xl min-w-[80px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl mb-1",
										children: "🔥"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: player.streak
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-bold uppercase",
										children: "Streak"
									})
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toy-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl mb-4 text-primary",
						children: "🏆 Global Leaderboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-muted-foreground mb-4",
						children: "Compete with friends to reach the top!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: leaderboard.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex justify-between items-center p-3 rounded-xl transition-all ${p.isMe ? "bg-primary/10 border-2 border-primary/20 scale-105 shadow-sm" : "bg-muted/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-display text-lg w-6 text-center ${i === 0 ? "text-sun" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`,
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: p.avatar
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-bold ${p.isMe ? "text-primary" : ""}`,
										children: [
											p.name,
											" ",
											p.isMe && "(You)"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-bold ${p.isMe ? "text-primary" : ""}`,
								children: [p.xp, " XP"]
							})]
						}, p.name))
					})
				]
			})]
		})
	});
}
//#endregion
export { ProfilePage as component };
