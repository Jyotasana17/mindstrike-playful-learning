import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as GameShell, o as JellyButton } from "./Layout-DoZPIDN4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rewards-CkImYSn8.js
var import_jsx_runtime = require_jsx_runtime();
function RewardsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		wide: true,
		title: "🎁 Rewards",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "toy-card flex min-h-[400px] flex-col items-center justify-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl mb-4 text-sun",
					children: "Coming Soon!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground font-bold mb-8",
					children: "The reward shop is being restocked. Check back later!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JellyButton, {
					to: "/",
					variant: "cream",
					children: "← Back to Home"
				})
			]
		})
	});
}
//#endregion
export { RewardsPage as component };
