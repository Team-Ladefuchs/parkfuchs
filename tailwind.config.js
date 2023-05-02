/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/tw-elements/dist/js/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				backgroundPrimary: "#ece9e1",
				cardBg: "#f9f8f6",
				green: "#D1D9C0",
				lightGreen: "#E9ECE0",
				red: "#D53D25",
				darkGreen: "#B0BD92",
				darkerGreen: "#9eaa83",
			},
			visibility: ["group-hover"],
			animation: {
				fade: "fadeIn 200ms ease-in-out",
				slideIn: "slideIn 275ms ease-in",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
				slideIn: {
					"0%": { top: "-50px", opacity: 0 },
					"100%": { top: "0", opacity: 1 },
				},
			},
		},
	},
	plugins: [],
};
