import { JSX, useEffect, useState } from "react";
import { useDebounce } from "../functions/debounce";
import SearchInput from "./SearchInput";
import { SlimCity } from "./Dialog";
import { autocomplete } from "../db/city";
import { ResultCity } from "../db/types";

export interface Properties {
	onSelectedCity: (city: SlimCity) => void;
	initQuery: string;
}

export default function AutoCompleteInput({
	onSelectedCity,
	initQuery = "",
}: Properties): JSX.Element {
	const [results, setResults] = useState<ResultCity[]>([]);

	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		if (isSearching) {
			return;
		}

		if (initQuery) {
			autoCompleteCities(initQuery).then(() =>
				console.log("[AutoCompleteInput] init fetching")
			);
		} else {
			setResults([]);
		}
		return () => {
			setIsSearching(false);
			setResults([]);
		};
	}, [initQuery]);

	const autoCompleteCities = async (searchTerm: string) => {
		if (searchTerm.length < 2) {
			setResults([]);
			return;
		}
		setIsSearching(true);
		const response = await autocomplete(searchTerm, 20);
		setResults(response);
		setIsSearching(false);
	};

	const debouncedAutoCompleteCities = useDebounce(autoCompleteCities, 220);

	return (
		<>
			<SearchInput
				onChange={debouncedAutoCompleteCities}
				initValue={initQuery}
			/>
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
								className="pl-6 group pt-3 pb-3 first:rounded-t-lg cursor-pointer hover:bg-green-light border-b border-gray-200 last:border-0"
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
