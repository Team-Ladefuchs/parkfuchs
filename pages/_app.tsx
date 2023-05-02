import "../styles/globals.css";

import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
				<title>Parkfuchs</title>
				<meta charSet="UTF-8" />
				<meta name="description" content="Schlau elektrisch parken" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<link
					rel="/font/bitter-v25-latin-ext_latin-500italic.woff2"
					type="font/woff2"
					as="font"
				></link>
				<link
					rel="/font/roboto-v29-latin-900.woff2"
					type="font/woff2"
					as="font"
				></link>
				<meta name="theme-color" content="#D1D9C0" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<link rel="manifest" href="/manifest.json" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-2048-2732.png"
					media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1668-2388.png"
					media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1536-2048.png"
					media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1668-2224.png"
					media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1620-2160.png"
					media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1290-2796.png"
					media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1179-2556.png"
					media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1284-2778.png"
					media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1170-2532.png"
					media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1125-2436.png"
					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1242-2688.png"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-828-1792.png"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-1242-2208.png"
					media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-750-1334.png"
					media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splashscreens/apple-splash-640-1136.png"
					media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>

				<link
					href="/icons/icon-48x48.png"
					rel="icon"
					type="image/png"
					sizes="48x48"
				/>
				<link
					href="/icons/icon-72x72.png"
					rel="icon"
					type="image/png"
					sizes="72x72"
				/>

				<link
					rel="apple-touch-icon"
					sizes="48x48"
					href="/icons/icon-48x48.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="72x72"
					href="/icons/icon-72x72.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="144x144"
					href="/icons/icon-144x144.png"
				/>

				<meta property="og:type" content="website" />
				<meta property="og:locale" content="de_DE" />
				<meta property="og:title" content="Parkfuchs" />
				<meta property="og:url" content="https://parkfuchs.app" />
				<meta
					property="og:site_name"
					content="Parkfuchs - Schlau elektrisch parken"
				/>
				<meta property="og:image" content="/parkfuchs-opengraph.jpg" />
				<meta
					property="og:description"
					content="Parkfuchs - Schlau elektrisch parken"
				/>
				<meta property="og:image:type" content="image/jpeg" />

				<meta property="twitter:domain" content="parkfuchs.app" />
				<meta property="twitter:url" content="https://parkfuchs.app/" />
				<meta name="twitter:title" content="Parkfuchs" />
				<meta
					name="twitter:description"
					content="Parkfuchs - Schlau elektrisch parken"
				/>
				<meta
					name="twitter:image"
					content="https://parkfuchs.app/parkfuchs-opengraph.jpg"
				/>

				<link rel="icon" type="image/x-icon" href="favicon.ico"></link>
			</Head>
			<Component {...pageProps} />
		</Layout>
	);
}
