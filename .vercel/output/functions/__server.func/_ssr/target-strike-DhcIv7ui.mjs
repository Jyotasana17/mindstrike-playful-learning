import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as numberType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/target-strike-DhcIv7ui.js
var $$splitComponentImporter = () => import("./target-strike-BcdRcbbt.mjs");
var Route = createFileRoute("/arcade/target-strike")({
	validateSearch: objectType({ level: numberType().optional() }),
	head: () => ({ meta: [{ title: "Target Strike" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
