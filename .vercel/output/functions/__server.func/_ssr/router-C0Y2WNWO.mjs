import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$8 } from "./carrom-BZQtZE9K.mjs";
import { t as Route$9 } from "./number-catcher-DwTJjC-y.mjs";
import { t as Route$10 } from "./result-Qav4GnNO.mjs";
import { t as Route$11 } from "./shape-hunter-BKraTapC.mjs";
import { t as Route$12 } from "./target-strike-BYturfxl.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C0Y2WNWO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DdLF8-Pz.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$6 = () => import("./routes-CKQvL-HN.mjs");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "MindStrike — Play. Think. Learn." },
		{
			name: "description",
			content: "MindStrike is a playful learning game universe for kids: carrom number challenges, shape hunting, number catching and a friendly AI coach."
		},
		{
			property: "og:title",
			content: "MindStrike — Play. Think. Learn."
		},
		{
			property: "og:description",
			content: "A colorful game world where children learn maths and science by playing."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./daily-B8rae5zZ.mjs");
var Route$5 = createFileRoute("/daily")({
	head: () => ({ meta: [{ title: "Daily Challenge" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./learning-BMl0MayD.mjs");
var Route$4 = createFileRoute("/learning")({
	head: () => ({ meta: [{ title: "AI Analysis" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./map-BPmge6LB.mjs");
var Route$3 = createFileRoute("/map")({
	head: () => ({ meta: [
		{ title: "Adventure Map — MindStrike Worlds" },
		{
			name: "description",
			content: "Travel from Number Garden to Knowledge Lab. Five colorful MindStrike worlds, three stars each."
		},
		{
			property: "og:title",
			content: "Adventure Map — MindStrike Worlds"
		},
		{
			property: "og:description",
			content: "A winding journey through five learning worlds."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./profile-B_xfKJR1.mjs");
var Route$2 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "Player Profile" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./rewards-CkImYSn8.mjs");
var Route$1 = createFileRoute("/rewards")({
	head: () => ({ meta: [{ title: "Rewards" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./arcade-Tnk7-mXL.mjs");
var Route = createFileRoute("/arcade/")({
	head: () => ({ meta: [{ title: "Mini Player — Arcade" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var CarromRoute = Route$8.update({
	id: "/carrom",
	path: "/carrom",
	getParentRoute: () => Route$7
});
var DailyRoute = Route$5.update({
	id: "/daily",
	path: "/daily",
	getParentRoute: () => Route$7
});
var LearningRoute = Route$4.update({
	id: "/learning",
	path: "/learning",
	getParentRoute: () => Route$7
});
var MapRoute = Route$3.update({
	id: "/map",
	path: "/map",
	getParentRoute: () => Route$7
});
var ProfileRoute = Route$2.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$7
});
var RewardsRoute = Route$1.update({
	id: "/rewards",
	path: "/rewards",
	getParentRoute: () => Route$7
});
var ArcadeIndexRoute = Route.update({
	id: "/arcade/",
	path: "/arcade/",
	getParentRoute: () => Route$7
});
var rootRouteChildren = {
	IndexRoute,
	CarromRoute,
	DailyRoute,
	LearningRoute,
	MapRoute,
	ProfileRoute,
	RewardsRoute,
	ArcadeNumberCatcherRoute: Route$9.update({
		id: "/arcade/number-catcher",
		path: "/arcade/number-catcher",
		getParentRoute: () => Route$7
	}),
	ArcadeResultRoute: Route$10.update({
		id: "/arcade/result",
		path: "/arcade/result",
		getParentRoute: () => Route$7
	}),
	ArcadeShapeHunterRoute: Route$11.update({
		id: "/arcade/shape-hunter",
		path: "/arcade/shape-hunter",
		getParentRoute: () => Route$7
	}),
	ArcadeTargetStrikeRoute: Route$12.update({
		id: "/arcade/target-strike",
		path: "/arcade/target-strike",
		getParentRoute: () => Route$7
	}),
	ArcadeIndexRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
