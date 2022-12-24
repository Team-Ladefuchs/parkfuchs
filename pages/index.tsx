import { GetServerSidePropsContext } from "next";
import { getNewestEnabledInboxCities } from "../db/city";
import type { InboxCity } from "../db/types";
import Dialog from "../components/Dialog";
import { useState } from "react";
import CityList from "../components/CityList";
import SearchInput from "../components/SearchInput";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useDebounce } from "../functions/debounce";
import Link from "next/link";
import LandingBox from "../components/LandingBox";
import Banner from "../components/Banner";

interface Properties {
	cities: Array<InboxCity>;
}

export async function getServerSideProps(_context: GetServerSidePropsContext) {
	const cities = await getNewestEnabledInboxCities(10);
	return {
		props: {
			cities,
		},
	};
}

export default function Contribute({ cities = [] }: Properties) {
	const [openForm, setOpenForm] = useState(false);

	const [results, setResults] = useState<Array<InboxCity>>(cities);
	const [isLoading, setIsLoading] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");

	const handleOnClose = () => {
		setOpenForm(false);
	};

	const onCitySearch = async (searchTerm: string) => {
		setSearchQuery(searchTerm);
		if (searchTerm.length === 0) {
			setResults([]);
			return;
		}
		setIsLoading(true);
		const response = await axios.get(`/api/search?query=${searchTerm}`);
		setResults(response.data);
		setIsLoading(false);
	};

	const debouncedOnCitySearch = useDebounce(onCitySearch, 150);

	const getItems = (): InboxCity[] => {
		if (searchQuery.length > 0 && results.length === 0) {
			return [];
		}
		return results.length > 0 ? results : cities;
	};
	const listIsEmpty =
		!isLoading && getItems().length === 0 && searchQuery.length > 0;
	return (
		<div
			className="justify-center w-[750px] max-md:w-w-11/12 min-h-[28rem]"
			role="main"
		>
			<Dialog
				isOpen={openForm}
				onClose={handleOnClose}
				initQuery={searchQuery}
			/>
			<section className="pb-12 mt-4 flex flex-col space-y-6">
				<div className="flex gap-5 max-md:gap-2 items-center justify-between max-md:flex-col">
					<SearchInput
						initQuery=""
						className="grow max-md:w-full"
						onChange={debouncedOnCitySearch}
					/>
					<div className="text-neutral-500 uppercase tracking-wide font-semibold text-sm">
						Oder
					</div>
					<button
						className="bg-green max-md:w-full max-md:justify-center gap-2 flex items-center text-lg rounded-lg hover:bg-darkGreen text-black w-max py-2 px-4 justify-self-start"
						onClick={(_e) => setOpenForm(true)}
					>
						<FontAwesomeIcon
							icon={faLocationDot}
							className="w-5 h-5 max-md:h-4 max-md:w-4"
						/>
						Ort hinzufügen
					</button>
				</div>
				<LandingBox hidden={searchQuery.length > 0} />
				<CityList
					className="mt-6"
					items={getItems()}
					isEmpty={listIsEmpty}
				/>
			</section>
			<Banner />
			<footer className="left-1/2 text-center text-neutral-700 opacity-60 uppercase tracking-wide font-semibold text-xs pb-5 mb-16">
				<p className="mb-1 mt-2">
					Alle Angaben ohne Gewähr
					{" · "}
					<Link href="impressum" className="hover:underline">
						Impressum
					</Link>
				</p>
			</footer>
		</div>
	);
}
