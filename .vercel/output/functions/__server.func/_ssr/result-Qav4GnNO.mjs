import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, n as enumType, r as objectType, t as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/result-Qav4GnNO.js
var $$splitComponentImporter = () => import("./result-Vga06rbu.mjs");
var resultSearchSchema = objectType({
	game: enumType([
		"shape-hunter",
		"number-catcher",
		"target-strike"
	]),
	level: coerce.number().min(1),
	score: coerce.number(),
	stars: coerce.number(),
	xp: coerce.number(),
	accuracy: coerce.number().optional(),
	combo: coerce.number().optional(),
	time: coerce.number().optional(),
	details: stringType().optional()
});
var Route = createFileRoute("/arcade/result")({
	validateSearch: resultSearchSchema,
	head: () => ({ meta: [{ title: "Level Complete!" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
