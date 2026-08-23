import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as objectType, t as coerce } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carrom-BZQtZE9K.js
var $$splitComponentImporter = () => import("./carrom-CviPlFOe.mjs");
var Route = createFileRoute("/carrom")({
	validateSearch: objectType({ world: coerce.number().min(1).max(5).optional() }),
	head: () => ({ meta: [
		{ title: "Carrom Number Challenge — MindStrike" },
		{
			name: "description",
			content: "Flick the striker into the right pocket: prime, even, odd or composite. A friendly illustrated carrom board with aim assist for kids."
		},
		{
			property: "og:title",
			content: "Carrom Number Challenge — MindStrike"
		},
		{
			property: "og:description",
			content: "Learn number classification by playing carrom."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
