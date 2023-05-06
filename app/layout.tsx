import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AppNav from "../components/AppNav";

import "../styles/globals.css";

const url = "https://parkfuchs.app";

export const metadata: Metadata = {
	title: "Parkfuchs",
	description: "Schlau elektrisch parken",
	themeColor: "#D1D9C0",
	viewport: "width=device-width, initial-scale=1.0",
	manifest: "/manifest.json",
	icons: [
		{
			rel: "apple-touch-startup-image",
			href: "/splashscreens/apple-splash-2048-2732.png",
			media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			url,
		},
		{
			rel: "apple-touch-startup-image",
			href: "/splashscreens/apple-splash-1668-2388.png",
			media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			url,
		},
		{
			rel: "apple-touch-startup-image",
			href: "/splashscreens/apple-splash-1536-2048.png",
			media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			url,
		},
		{
			rel: "apple-touch-startup-image",
			href: "/splashscreens/apple-splash-1668-2224.png",
			media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			url,
		},
		{
			rel: "apple-touch-startup-image",
			href: "/splashscreens/apple-splash-1620-2160.png",
			media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			url,
		},
		{
			rel: "apple-touch-startup-image",
			href: "/splashscreens/apple-splash-1290-2796.png",
			media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			url,
		},
		{
			href: "/icons/icon-48x48.png",
			rel: "icon",
			type: "image/png",
			sizes: "48x48",
			url,
		},
		{
			href: "/icons/icon-72x72.png",
			rel: "icon",
			type: "image/png",
			sizes: "72x72",
			url,
		},

		{
			rel: "apple-touch-icon",
			sizes: "144x144",
			href: "/icons/icon-144x144.png",
			url,
		},
		{
			rel: "icon",
			type: "image/x-icon",
			href: "favicon.ico",
			url,
		},
	],
	openGraph: {
		type: "website",
		locale: "de_DE",
		title: "Parkfuchs",
		url,
		siteName: "Parkfuchs - Schlau elektrisch parken",
		description: "Parkfuchs - Schlau elektrisch parken",
		images: {
			type: "image/jpeg",
			url: "/parkfuchs-opengraph.jpg",
		},
	},
	twitter: {
		title: "Parkfuchs",
		description: "Parkfuchs - Schlau elektrisch parken",
		images: "parkfuchs-opengraph.jpg",
		site: url,
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="de">
			<body>
				<AppNav />
				<main className="flex flex-col justify-center py-6 max-md:px-4 max-md:pt-5">
					{children}
				</main>

				<Toaster
					position="top-center"
					containerStyle={{ top: "14%" }}
					reverseOrder={false}
				/>
			</body>
		</html>
	);
}