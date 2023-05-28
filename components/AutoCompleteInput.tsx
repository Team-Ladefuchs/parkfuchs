import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useDebounce } from "../functions/debounce";
import SearchInput from "./SearchInput";
import { SlimCity } from "./Dialog";
import { AppContext } from "../context/appContext";

export interface Properties {
	onSelectedCity: (city: SlimCity) => void;
	initQuery: string;
}

export default function AutoCompleteInput({
	onSelectedCity,
}: Properties): JSX.Element {
	const { searchQuery } = useContext(AppContext);

	const [results, setResults] = useState<Array<SlimCity>>([]);

	useEffect(() => {
		if (searchQuery) {
			autoCompleteCities(searchQuery).then(() =>
				console.log("init fetching")
			);
		} else {
			setResults([]);
		}
	}, [searchQuery]);

	const autoCompleteCities = async (searchTerm: string) => {
		if (searchTerm.length < 2) {
			setResults([]);
			return;
		}
		const response = await axios.get(`/api/autocomplete/${searchTerm}`);
		setResults(response.data);
	};

	const debouncedAutoCompleteCities = useDebounce(autoCompleteCities, 110);

	return (
		<>
			<SearchInput onChange={debouncedAutoCompleteCities} />
			{results.length > 0 && (
				<ul className="bg-neutral-100 rounded-lg w-full max-h-80 overflow-y-auto list">
					{results.map((item) => {
						return (
							<li
								key={item.id}
								onClick={(_e) => {
									setResults([]);
									onSelectedCity({
										id: item.id,
										name: item.name,
										state: item.state,
										stateCode: item.stateCode,
										cityRefId: item.id,
										postcode: item.postcode,
										exists: item.exists,
									});
								}}
								className="pl-6 group pt-3 pb-3 first:rounded-t-lg cursor-pointer hover:bg-lightGreen border-b border-gray-200 last:border-0"
							>
								<div className="flex gap-1 items-baseline">
									<div>{item.name}</div>
									<div className="text-neutral-500">
										({item.stateCode}){" "}
										{item.exists ? "🅿️🦊" : ""}
									</div>
								</div>

								<p className="p-0 text-neutral-500">
									{item.postcode.slice(0, 10).join(", ")}
								</p>
							</li>
						);
					})}
				</ul>
			)}
		</>
	);
}
