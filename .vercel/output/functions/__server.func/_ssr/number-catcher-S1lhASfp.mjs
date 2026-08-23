import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as objectType, n as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/number-catcher-S1lhASfp.js
var $$splitComponentImporter = () => import("./number-catcher-BBm4bfSg.mjs");
var Route = createFileRoute("/arcade/number-catcher")({
	validateSearch: objectType({ level: coerce.number().optional() }),
	head: () => ({ meta: [{ title: "Number Catcher" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
