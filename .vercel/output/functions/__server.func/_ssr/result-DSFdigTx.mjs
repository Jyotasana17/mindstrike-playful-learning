import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as recordType, i as objectType, n as coerce, r as enumType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/result-DSFdigTx.js
var $$splitComponentImporter = () => import("./result-C5O6DQYz.mjs");
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
	details: recordType(anyType()).optional()
});
var Route = createFileRoute("/arcade/result")({
	validateSearch: resultSearchSchema,
	head: () => ({ meta: [{ title: "Level Complete!" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
