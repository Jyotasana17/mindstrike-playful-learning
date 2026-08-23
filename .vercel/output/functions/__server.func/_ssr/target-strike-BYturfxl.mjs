import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as objectType, t as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/target-strike-BYturfxl.js
var $$splitComponentImporter = () => import("./target-strike-0D1As_po.mjs");
var Route = createFileRoute("/arcade/target-strike")({
	validateSearch: objectType({ level: coerce.number().optional() }),
	head: () => ({ meta: [{ title: "Target Strike" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
