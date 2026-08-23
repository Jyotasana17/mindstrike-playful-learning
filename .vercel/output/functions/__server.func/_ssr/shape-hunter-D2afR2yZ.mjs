import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as numberType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shape-hunter-D2afR2yZ.js
var $$splitComponentImporter = () => import("./shape-hunter-DABi__2H.mjs");
var Route = createFileRoute("/arcade/shape-hunter")({
	validateSearch: objectType({ level: numberType().optional() }),
	head: () => ({ meta: [{ title: "Shape Hunter" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
