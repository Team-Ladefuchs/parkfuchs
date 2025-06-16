import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import AppNav from "../components/AppNav";

import "../styles/globals.css";

const url = "https://parkfuchs.app";

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: "#D1D9C0B8",
	width: "width=device-width, initial-scale=1.0",
	initialScale: 1,
};

export const metadata: Metadata = {
	title: "Parkfuchs",
	description: "Schlau elektrisch parken",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Parkfuchs",
		startupImage: [
			{
				url: "/splashscreens/apple-splash-2048-2732.png",
				media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splashscreens/apple-splash-1668-2388.png",
				media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splashscreens/apple-splash-1536-2048.png",
				media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splashscreens/apple-splash-1668-2224.png",
				media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splashscreens/apple-splash-1620-2160.png",
				media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
			},
			{
				url: "/splashscreens/apple-splash-1290-2796.png",
				media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
		],
	},
	itunes: {
		appId: "6460892143",
	},
	icons: [
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
			url: `${url}/parkfuchs-opengraph.jpg`,
		},
	},
	twitter: {
		title: "Parkfuchs",
		description: "Parkfuchs - Schlau elektrisch parken",
		images: `${url}/parkfuchs-opengraph.jpg`,
		site: url,
	},
};

const bitterItalic = localFont({
	src: "../public/fonts/bitter-v25-latin-ext_latin-500italic.woff2",
	weight: "500",
	style: "italic",
	display: "swap",
	preload: true,
});

const robotoBold = localFont({
	src: "../public/fonts/roboto-v29-latin-900.woff2",
	weight: "900",
	style: "normal",
	display: "swap",
	preload: true,
});

export default function RootLayout({ children }) {
	return (
		<html lang="de">
			<body>
				<AppNav />
				<main className="w-full py-6 max-md:px-4 max-md:pt-5">
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
