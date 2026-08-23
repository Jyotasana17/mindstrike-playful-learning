import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { m as cn } from "./Layout-DoZPIDN4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Mascot-DVIeqxcP.js
var import_jsx_runtime = require_jsx_runtime();
/** Striko — the MindStrike mascot. A friendly round fox-cat spark creature. */
function Mascot({ mood = "happy", size = 120, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 120 120",
		width: size,
		height: size,
		className: cn(mood === "celebrate" ? "animate-bounce-soft" : mood === "surprised" ? "animate-wobble" : "animate-bob", "drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]", className),
		role: "img",
		"aria-label": "Striko the MindStrike mascot",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
				id: "ms-body",
				cx: "35%",
				cy: "28%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "oklch(0.85 0.15 60)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "oklch(0.68 0.19 42)"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M28 34 L22 10 L46 24 Z",
				fill: "oklch(0.7 0.19 42)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M92 34 L98 10 L74 24 Z",
				fill: "oklch(0.7 0.19 42)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M30 30 L27 17 L41 25 Z",
				fill: "oklch(0.9 0.06 40)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M90 30 L93 17 L79 25 Z",
				fill: "oklch(0.9 0.06 40)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "64",
				r: "40",
				fill: "url(#ms-body)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "60",
				cy: "76",
				rx: "26",
				ry: "22",
				fill: "oklch(0.97 0.03 80)"
			}),
			mood === "think" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 58 q7 -6 14 0",
				stroke: "oklch(0.3 0.05 60)",
				strokeWidth: "4",
				fill: "none",
				strokeLinecap: "round"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M66 58 q7 -6 14 0",
				stroke: "oklch(0.3 0.05 60)",
				strokeWidth: "4",
				fill: "none",
				strokeLinecap: "round"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "47",
					cy: "57",
					r: mood === "surprised" ? 9 : 7,
					fill: "oklch(0.25 0.04 60)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "73",
					cy: "57",
					r: mood === "surprised" ? 9 : 7,
					fill: "oklch(0.25 0.04 60)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "49.5",
					cy: "54.5",
					r: "2.6",
					fill: "oklch(0.99 0 0)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "75.5",
					cy: "54.5",
					r: "2.6",
					fill: "oklch(0.99 0 0)"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "36",
				cy: "70",
				r: "6",
				fill: "oklch(0.78 0.13 20)",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "84",
				cy: "70",
				r: "6",
				fill: "oklch(0.78 0.13 20)",
				opacity: "0.55"
			}),
			mood === "surprised" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "60",
				cy: "74",
				rx: "6",
				ry: "8",
				fill: "oklch(0.4 0.12 20)"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M50 72 q10 12 20 0",
				stroke: "oklch(0.32 0.06 40)",
				strokeWidth: "4",
				fill: "none",
				strokeLinecap: "round"
			}),
			mood === "wave" || mood === "celebrate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				className: "origin-[24px_64px] animate-[wobble_0.9s_ease-in-out_infinite]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "20",
					cy: "46",
					r: "9",
					fill: "oklch(0.72 0.19 42)"
				})
			}) : mood === "point" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "102",
				cy: "70",
				r: "9",
				fill: "oklch(0.72 0.19 42)"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "20",
				cy: "70",
				r: "9",
				fill: "oklch(0.72 0.19 42)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "70",
				r: "9",
				fill: "oklch(0.72 0.19 42)"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M60 22 l6 12 h-12 z",
				fill: "oklch(0.86 0.16 88)"
			})
		]
	});
}
function MascotBubble({ text, mood = "happy", size = 110, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-end gap-2 sm:gap-3", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mascot, {
			mood,
			size
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-pop-in relative mb-4 max-w-[16rem] rounded-3xl border-3 border-foreground/10 bg-card px-4 py-3 text-sm font-bold shadow-[var(--shadow-toy)] sm:text-base",
			children: [text, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-2 bottom-4 h-4 w-4 rotate-45 border-b-3 border-l-3 border-foreground/10 bg-card" })]
		})]
	});
}
//#endregion
export { MascotBubble as n, Mascot as t };
