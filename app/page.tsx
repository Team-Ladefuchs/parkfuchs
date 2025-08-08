import Link from "next/link";
import Home from "../components/Home";
import { getCityCount, getEnabledInboxCities } from "../db/city";
import { JSX, Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Index() {
	const [cities, cityStates] = await Promise.all([
		getEnabledInboxCities(),
		getCityCount(),
	]);

	return (
		<>
			<Suspense fallback={<Loading />}>
				<Home cities={cities} cityStates={cityStates} />
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
		<p className="text-center text-2xl my-8 p-4 w-full">
			Der Fuchs aufgeladen...
		</p>
	);
}
