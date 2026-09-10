import { tanstackConfig } from "@tanstack/eslint-config";

export default [
	...tanstackConfig,
	{
		ignores: [
			".output/**",
			".nitro/**",
			"node_modules/**",
			"pocketbase-db/**",
			"public/**",
			"android/**",
			"nix/**",
			"src/routeTree.gen.ts",
			"eslint.config.js",
		],
	},
	{
		files: ["**/*.{js,ts,tsx}"],
		rules: {
			quotes: ["error", "double"],
			// Single statements per module with inline type specifiers.
			"import/consistent-type-specifier-style": ["error", "prefer-inline"],
			// The tsconfig `@/*` alias is used for all project-internal imports.
			"import/no-restricted-paths": "off",
			// The codebase intentionally uses defensive checks around browser
			// APIs and refs; this rule is too aggressive for that style.
			"@typescript-eslint/no-unnecessary-condition": "off",
		},
	},
];
