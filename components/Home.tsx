"use client";

import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { CityStats, InboxCity } from "../db/types";
import { useDebounce } from "../functions/debounce";
import CityList from "./CityList";
import Dialog from "./Dialog";
import LandingBox from "./LandingBox";
import SearchInput from "./SearchInput";
import { AppContextProvider } from "../context/appContext";
import { useSearchParams } from "next/navigation";
import { search as searchCity } from "../db/city";

export default function Home({
	cities,
	cityStates,
}: {
	cities: Array<InboxCity>;
	cityStates: CityStats;
}) {
	const [openDialog, setOpenDialog] = useState(false);

	const [results, setResults] = useState<Array<InboxCity>>(cities);
	const [isLoading, setIsLoading] = useState(false);

	const searchParams = useSearchParams();

	const [searchQuery, setSearchQuery] = useState("");

	const handleOnClose = () => {
		setOpenDialog(false);
	};

	const onCitySearch = async (searchTerm: string) => {
		setSearchQuery(searchTerm);
		if (searchTerm.length === 0) {
			setResults([]);
			return;
		}
		setIsLoading(true);
		const response = await searchCity(searchTerm, 15);
		setResults(response);
		setIsLoading(false);
	};

	const debouncedOnCitySearch = useDebounce(onCitySearch, 225);

	const getItems = (): InboxCity[] => {
		if (searchQuery.length > 0 && results.length === 0) {
			return [];
		}
		return results.length > 0 ? results : cities;
	};
	const listIsEmpty =
		!isLoading && getItems().length === 0 && searchQuery.length > 0;

	return (
		<AppContextProvider>
			<div className="mx-auto w-full max-w-[750px] min-h-112" role="main">
				<Dialog
					isOpen={openDialog}
					onClose={handleOnClose}
					initQuery={searchQuery}
				/>
				<section className="pb-12 flex flex-col space-y-6 max-md:space-y-4">
					<div className="flex gap-5 max-md:gap-2 items-center justify-between max-md:flex-col">
						<SearchInput
							className="grow max-md:w-full"
							initValue={searchParams.get("query") ?? ""}
							onChange={debouncedOnCitySearch}
						/>
						<div className="text-neutral-600 uppercase tracking-wide font-semibold text-sm">
							Oder
						</div>
						<button
							className="bg-green-normal max-md:w-full max-md:justify-center gap-2 flex items-center text-lg rounded-lg hover:bg-green-dark text-black w-max py-2 px-4 justify-self-start"
							onClick={(_e) => setOpenDialog(true)}
						>
							<FontAwesomeIcon
								icon={faLocationDot}
								className="w-5 h-5 max-md:h-4 max-md:w-4"
							/>
							Ort hinzufügen
						</button>
					</div>
					<LandingBox
						cityStats={cityStates}
						hidden={searchQuery.length > 0}
					/>
					<section>
						<CityList
							className="min-h-84"
							items={getItems()}
							isEmpty={listIsEmpty}
							onOpenDialog={() => setOpenDialog(true)}
						/>
					</section>
				</section>
			</div>
		</AppContextProvider>
	);
}
