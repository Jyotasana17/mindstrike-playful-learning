import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as GameShell, o as JellyButton } from "./Layout-DoZPIDN4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arcade-Tnk7-mXL.js
var import_jsx_runtime = require_jsx_runtime();
function ArcadePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		wide: true,
		title: "🎯 Mini Player",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-3 mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "toy-card flex flex-col items-center p-6 text-center animate-rise",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-6xl mb-4",
							children: "🔺"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Shape Hunter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm font-bold mt-2 mb-6",
							children: "Find the correct shapes before time runs out!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							to: "/arcade/shape-hunter",
							variant: "sun",
							className: "mt-auto w-full",
							children: "Play"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "toy-card flex flex-col items-center p-6 text-center animate-rise",
					style: { animationDelay: "100ms" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-6xl mb-4",
							children: "🪣"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Number Catcher"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm font-bold mt-2 mb-6",
							children: "Catch numbers to build the target equation."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							to: "/arcade/number-catcher",
							variant: "play",
							className: "mt-auto w-full",
							children: "Play"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "toy-card flex flex-col items-center p-6 text-center animate-rise",
					style: { animationDelay: "200ms" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-6xl mb-4",
							children: "☄️"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Target Strike"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm font-bold mt-2 mb-6",
							children: "Shoot the correct elements or numbers!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
							to: "/arcade/target-strike",
							variant: "primary",
							className: "mt-auto w-full",
							children: "Play"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ArcadePage as component };
