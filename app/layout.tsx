import type { Metadata } from "next";
import Head from "next/head";
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
	// twitter: {
	// 	title: "Parkfuchs",
	// 	description: "Parkfuchs - Schlau elektrisch parken",
	// 	images: "/parkfuchs-opengraph.jpg",
	// 	site: url,
	// },
};

export default function RootLayout({ children }) {
	return (
		<html lang="de">
			<Head>
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
			</Head>
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
