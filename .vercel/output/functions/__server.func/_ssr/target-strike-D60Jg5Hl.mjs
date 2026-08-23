import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as objectType, n as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/target-strike-D60Jg5Hl.js
var $$splitComponentImporter = () => import("./target-strike-m-2j7EHn.mjs");
var Route = createFileRoute("/arcade/target-strike")({
	validateSearch: objectType({ level: coerce.number().optional() }),
	head: () => ({ meta: [{ title: "Target Strike" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
