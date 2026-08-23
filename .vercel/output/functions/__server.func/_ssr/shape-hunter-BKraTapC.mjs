import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as objectType, t as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shape-hunter-BKraTapC.js
var $$splitComponentImporter = () => import("./shape-hunter-BEi_QBI2.mjs");
var Route = createFileRoute("/arcade/shape-hunter")({
	validateSearch: objectType({ level: coerce.number().optional() }),
	head: () => ({ meta: [{ title: "Shape Hunter" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
