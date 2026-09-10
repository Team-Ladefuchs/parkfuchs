import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => {
	// Load .env files into the runtime environment so server functions
	// receive TOMTOM_KEY & co. No VITE_ prefix filter.
	Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

	return {
		server: {
			port: 3000,
			watch: {
				ignored: ["**/.direnv/**"],
			},
		},
		resolve: {
			// Enables Vite to resolve imports using path aliases.
			tsconfigPaths: true,
		},
		ssr: {
			// react-timeago ships an ESM build with extensionless imports that Node
			// cannot resolve when the package is externalized during SSR.
			noExternal: ["react-timeago"],
		},
		plugins: [
			tailwindcss(),
			tanstackStart({
				srcDirectory: "src",
				router: {
					// Routes live in the non-default src/app directory.
					routesDirectory: "app",
				},
			}),
			// react's vite plugin must come after start's vite plugin
			viteReact(),
			nitro(),
		],
	};
});
