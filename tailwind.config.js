/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
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
				bounceX: "bounceX 1.8s infinite",
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
				bounceX: {
					"0%, 100%": {
						transform: "translateX(-25%)",
						animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
					},
					"50%": {
						transform: "translateY(0)",
						animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
					},
				},
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
