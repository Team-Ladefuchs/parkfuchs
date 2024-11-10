const withPWA = require("next-pwa")({
	dest: "public",
	skipWaiting: true,
});

module.exports = withPWA({
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
	i18n: {
		locales: ["de"],
		defaultLocale: "de",
	},
	output: "standalone",
});
