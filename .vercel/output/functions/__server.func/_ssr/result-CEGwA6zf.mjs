import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/result-CEGwA6zf.js
var $$splitComponentImporter = () => import("./result-2CYbgnla.mjs");
var resultSearchSchema = objectType({
	game: enumType([
		"shape-hunter",
		"number-catcher",
		"target-strike"
	]),
	level: numberType().min(1),
	score: numberType(),
	stars: numberType(),
	xp: numberType(),
	accuracy: numberType().optional(),
	combo: numberType().optional(),
	time: numberType().optional(),
	details: stringType().optional()
});
var Route = createFileRoute("/arcade/result")({
	validateSearch: resultSearchSchema,
	head: () => ({ meta: [{ title: "Level Complete!" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
