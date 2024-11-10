const withPWA = require("next-pwa")({
	dest: "public",
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development", // Disable PWA in development
});

module.exports = withPWA({
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
	i18n: {
		locales: ["de"],
		defaultLocale: "de",
	},
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "parkfuchs.app",
				port: "",
			},
		],
	},
	experimental: {
		outputFileTracing: false, // Disable output file tracing
		cache: false, // Disable disk caching
	},
});
