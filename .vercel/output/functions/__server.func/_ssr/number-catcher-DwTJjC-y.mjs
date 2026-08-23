import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as objectType, t as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/number-catcher-DwTJjC-y.js
var $$splitComponentImporter = () => import("./number-catcher-CeFmaqnK.mjs");
var Route = createFileRoute("/arcade/number-catcher")({
	validateSearch: objectType({ level: coerce.number().optional() }),
	head: () => ({ meta: [{ title: "Number Catcher" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
