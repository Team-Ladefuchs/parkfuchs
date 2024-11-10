module.exports = {
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
		reactCompiler: true,
	},
};
