import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as numberType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/number-catcher-FV2sOWhK.js
var $$splitComponentImporter = () => import("./number-catcher-DeXzwNf2.mjs");
var Route = createFileRoute("/arcade/number-catcher")({
	validateSearch: objectType({ level: numberType().optional() }),
	head: () => ({ meta: [{ title: "Number Catcher" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
