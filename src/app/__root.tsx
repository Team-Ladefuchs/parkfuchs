import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import AppNav from "@/components/AppNav";
import { AppContextProvider } from "@/context/appContext";
import ErrorPage from "@/components/ErrorPage";
import NotFound from "@/components/NotFound";
import appCss from "@/styles/globals.css?url";

const url = "https://parkfuchs.app";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0",
			},
			{ name: "color-scheme", content: "light" },
			{ name: "theme-color", content: "#D1D9C0B8" },
			{ title: "Parkfuchs" },
			{ name: "description", content: "Schlau elektrisch parken" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default",
			},
			{ name: "apple-mobile-web-app-title", content: "Parkfuchs" },
			{ name: "apple-itunes-app", content: "app-id=6460892143" },
			{ property: "og:type", content: "website" },
			{ property: "og:locale", content: "de_DE" },
			{ property: "og:title", content: "Parkfuchs" },
			{ property: "og:url", content: url },
			{
				property: "og:site_name",
				content: "Parkfuchs - Schlau elektrisch parken",
			},
			{
				property: "og:description",
				content: "Parkfuchs - Schlau elektrisch parken",
			},
			{ property: "og:image", content: `${url}/parkfuchs-opengraph.jpg` },
			{ property: "og:image:type", content: "image/jpeg" },
			{ name: "twitter:title", content: "Parkfuchs" },
			{
				name: "twitter:description",
				content: "Parkfuchs - Schlau elektrisch parken",
			},
			{
				name: "twitter:image",
				content: `${url}/parkfuchs-opengraph.jpg`,
			},
			{ name: "twitter:site", content: url },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "manifest", href: "/manifest.json" },
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "48x48",
				href: "/icons/icon-48x48.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "72x72",
				href: "/icons/icon-72x72.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "144x144",
				href: "/icons/icon-144x144.png",
			},
			{
				rel: "apple-touch-startup-image",
				media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
				href: "/splashscreens/apple-splash-2048-2732.png",
			},
			{
				rel: "apple-touch-startup-image",
				media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
				href: "/splashscreens/apple-splash-1668-2388.png",
			},
			{
				rel: "apple-touch-startup-image",
				media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
				href: "/splashscreens/apple-splash-1536-2048.png",
			},
			{
				rel: "apple-touch-startup-image",
				media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
				href: "/splashscreens/apple-splash-1668-2224.png",
			},
			{
				rel: "apple-touch-startup-image",
				media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
				href: "/splashscreens/apple-splash-1620-2160.png",
			},
			{
				rel: "apple-touch-startup-image",
				media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
				href: "/splashscreens/apple-splash-1290-2796.png",
			},
		],
	}),
	errorComponent: ErrorPage,
	notFoundComponent: NotFound,
	component: RootLayout,
});

function RootLayout() {
	return (
		<html lang="de" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<AppContextProvider>
					<AppNav />
					<main className="w-full py-6 max-md:px-4 max-md:pt-5">
						<Outlet />
					</main>

					<Toaster
						position="top-center"
						containerStyle={{ top: "14%" }}
						reverseOrder={false}
					/>
				</AppContextProvider>
				<Scripts />
			</body>
		</html>
	);
}
