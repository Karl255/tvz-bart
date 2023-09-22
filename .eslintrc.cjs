module.exports = {
	root: true,
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:svelte/recommended", "prettier"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		extraFileExtensions: [".svelte"],
	},
	plugins: ["svelte", "@typescript-eslint", "prettier"],
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	settings: {
		"svelte3/typescript": () => require("typescript"),
	},
	overrides: [
		{
			files: ["*.svelte"],
			processor: "svelte/svelte",
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	],
	rules: {
		"prettier/prettier": ["warn"],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				varsIgnorePattern: "^_",
				argsIgnorePattern: "^_",
			},
		],
	},
};
