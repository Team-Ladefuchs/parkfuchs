import Link from "next/link";
import Banner from "../components/Banner";
import Home from "../components/Home";
import { getCityCount, getEnabledInboxCities } from "../db/city";
import { getTGHLink } from "../db/config";
import { JSX, Suspense } from "react";

export default async function Index() {
	const [cities, thgLink, cityStates] = await Promise.all([
		getEnabledInboxCities(),
		getTGHLink(),
		getCityCount(),
	]);

	return (
		<>
			<Suspense fallback={<Loading />}>
				<Home cities={cities} cityStates={cityStates} />
				<Banner link={thgLink} />
			</Suspense>
			<footer className="left-1/2 text-center text-neutral-600 opacity-90 uppercase tracking-wide font-semibold text-xs pb-5 mb-16">
				<p className="mb-1 mt-2">
					Alle Angaben ohne Gewähr
					{" · "}
					<Link
						href="/impressum#top"
						className="hover:underline"
						prefetch={false}
					>
						Impressum & Team
					</Link>
				</p>
			</footer>
		</>
	);
}

function Loading(): JSX.Element {
	return (
		<p className="text-center text-2xl my-8 p-4">Der Fuchs aufgeladen...</p>
	);
}
