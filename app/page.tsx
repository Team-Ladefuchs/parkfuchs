import Link from "next/link";
import Banner from "../components/Banner";
import Home from "../components/Home";
import { getCityCount, getNewestEnabledInboxCities } from "../db/city";
import { getTGHLink } from "../db/config";

export const dynamic = "auto",
	runtime = "nodejs",
	revalidate = 0,
	fetchCache = "auto";

async function fetchData() {
	const [cities, thgLink] = await Promise.all([
		getNewestEnabledInboxCities(10),
		getTGHLink(),
	]);

	const cityStates = await getCityCount();

	return {
		cities,
		cityStates,
		thgLink,
	};
}

export default async function Index() {
	const { cities = [], thgLink, cityStates } = await fetchData();

	return (
		<>
			<Home cities={cities} cityStates={cityStates} />
			<Banner link={thgLink} />
			<footer className="left-1/2 text-center text-neutral-600 opacity-90 uppercase tracking-wide font-semibold text-xs pb-5 mb-16">
				<p className="mb-1 mt-2">
					Alle Angaben ohne Gewähr
					{" · "}
					<Link
						href="/impressum"
						className="hover:underline"
						prefetch={false}
					>
						Impressum
					</Link>
				</p>
			</footer>
		</>
	);
}
