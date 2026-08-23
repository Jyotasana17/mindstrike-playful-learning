import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Lock } from "../_libs/lucide-react.mjs";
import { _ as sfx, d as Stars, i as GameShell, m as cn, o as JellyButton, x as usePlayer } from "./Layout-DoZPIDN4.mjs";
import { n as MascotBubble } from "./Mascot-DVIeqxcP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-BPmge6LB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WORLDS = [
	{
		id: 1,
		name: "Number Garden",
		icon: "🌱",
		tint: "bg-gradient-play",
		x: 14,
		y: 82,
		topic: "Even & odd numbers"
	},
	{
		id: 2,
		name: "Prime Valley",
		icon: "🔢",
		tint: "bg-gradient-sun",
		x: 36,
		y: 62,
		topic: "Prime numbers"
	},
	{
		id: 3,
		name: "Composite Castle",
		icon: "🏰",
		tint: "bg-gradient-coral",
		x: 58,
		y: 76,
		topic: "Composite numbers"
	},
	{
		id: 4,
		name: "Number Space",
		icon: "🚀",
		tint: "bg-gradient-primary",
		x: 74,
		y: 44,
		topic: "Mixed classification"
	},
	{
		id: 5,
		name: "Knowledge Lab",
		icon: "🧪",
		tint: "bg-gradient-grape",
		x: 90,
		y: 22,
		topic: "Challenge world"
	}
];
function MapPage() {
	const { player } = usePlayer();
	const navigate = useNavigate();
	const [wobble, setWobble] = (0, import_react.useState)(0);
	const highestDone = WORLDS.reduce((acc, w) => (player.worlds[w.id] ?? 0) > 0 ? Math.max(acc, w.id) : acc, 0);
	const currentId = Math.min(WORLDS.length, highestDone + 1);
	const current = WORLDS.find((w) => w.id === currentId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameShell, {
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl sm:text-4xl",
					children: "🗺️ Adventure Map"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-bold text-muted-foreground",
					children: [
						"Now exploring: ",
						current.icon,
						" ",
						current.name,
						" — ",
						current.topic
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(JellyButton, {
					variant: "play",
					to: "/carrom",
					children: ["▶️ Play ", current.name]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toy-card relative h-[26rem] overflow-hidden p-0 sm:h-[32rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-sky to-mint/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-16 left-[-5%] h-56 w-[70%] rounded-[50%] bg-mint/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-10 right-[-10%] h-48 w-[60%] rounded-[50%] bg-mint/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-6 left-6 h-16 w-32 rounded-full bg-card/70 animate-drift" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-20 left-0 h-10 w-24 rounded-full bg-card/60 animate-drift-slow" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "absolute inset-0 h-full w-full",
						viewBox: "0 0 100 100",
						preserveAspectRatio: "none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
							points: WORLDS.map((w) => `${w.x},${w.y}`).join(" "),
							fill: "none",
							stroke: "oklch(0.95 0.03 92)",
							strokeWidth: "3.4",
							strokeLinecap: "round",
							strokeDasharray: "6 4",
							vectorEffect: "non-scaling-stroke"
						})
					}),
					WORLDS.map((w) => {
						const unlocked = w.id <= highestDone + 1;
						const stars = player.worlds[w.id] ?? 0;
						const isCurrent = w.id === currentId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -translate-x-1/2 -translate-y-1/2",
							style: {
								left: `${w.x}%`,
								top: `${w.y}%`
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										if (!unlocked) {
											sfx.oops();
											setWobble(w.id);
											setTimeout(() => setWobble(0), 500);
											return;
										}
										sfx.click();
										navigate({
											to: "/carrom",
											search: { world: w.id }
										});
									},
									className: cn("jelly flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border-4 border-card sm:h-24 sm:w-24", unlocked ? w.tint : "bg-locked", isCurrent && "ring-6 ring-sun animate-pulse-glow", wobble === w.id && "animate-wobble"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl leading-none sm:text-3xl",
											children: unlocked ? w.icon : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "text-card" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-display text-xs leading-none text-card",
											children: ["Lv ", w.id]
										}),
										unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
											count: stars,
											size: 11
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display mt-1 w-28 -translate-x-[14%] text-center text-xs leading-tight drop-shadow-sm sm:text-sm",
									children: w.name
								}),
								isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-bob pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-3xl",
									children: "🦊"
								})
							]
						}, w.id);
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MascotBubble, {
				className: "mt-5",
				mood: "point",
				size: 90,
				text: highestDone === 0 ? "Start in Number Garden — I'll show you how to strike!" : highestDone >= WORLDS.length ? "All worlds explored! Go for 3 stars everywhere ⭐" : `Nice! ${current.name} is open. Let's grab three stars!`
			})
		]
	});
}
//#endregion
export { MapPage as component };
