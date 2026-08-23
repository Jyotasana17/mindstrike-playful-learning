import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as objectType, n as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shape-hunter-DgS_1_9T.js
var $$splitComponentImporter = () => import("./shape-hunter-BOEois47.mjs");
var Route = createFileRoute("/arcade/shape-hunter")({
	validateSearch: objectType({ level: coerce.number().optional() }),
	head: () => ({ meta: [{ title: "Shape Hunter" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
