import { Link, createFileRoute } from "@tanstack/react-router";
import { type JSX } from "react";
import Home from "@/components/Home";
import { getCityCount, getEnabledInboxCities } from "@/db/city.functions";

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>): { query?: string } => {
		if (typeof search.query === "string") {
			return { query: search.query };
		}

		return {};
	},
	loader: async () => {
		const [cities, cityStates] = await Promise.all([
			getEnabledInboxCities(),
			getCityCount(),
		]);

		return { cities, cityStates };
	},
	pendingComponent: Loading,
	component: Index,
});

function Index() {
	const { cities, cityStates } = Route.useLoaderData();
	const { query } = Route.useSearch();

	return (
		<>
			<Home
				cities={cities}
				cityStates={cityStates}
				initialQuery={query ?? ""}
			/>

			<footer className="left-1/2 text-center text-neutral-600 opacity-90 uppercase tracking-wide font-semibold text-xs pb-5 mb-16">
				<p className="mb-1 mt-2">
					Alle Angaben ohne Gewähr
					{" · "}
					<Link
						to="/impressum"
						hash="top"
						preload={false}
						className="hover:underline"
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
