module.exports = {
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
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
