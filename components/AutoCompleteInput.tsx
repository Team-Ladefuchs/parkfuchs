import axios from "axios";
import { useEffect, useState } from "react";
import { ResultCity } from "../db/types";
import { useDebounce } from "../functions/debounce";
import SearchInput from "./SearchInput";

export interface Properties {
	onSelectedCity: (city: ResultCity) => void;
	initQuery: string;
}

export default function AutoCompleteInput({
	onSelectedCity,
	initQuery = "",
}: Properties): JSX.Element {
	const [results, setResults] = useState<Array<ResultCity>>([]);

	useEffect(() => {
		if (initQuery) {
			autoCompleteCities(initQuery).then(() =>
				console.log("init fetching")
			);
		}
	}, [initQuery]);

	const autoCompleteCities = async (searchTerm: string) => {
		if (searchTerm.length < 2) {
			setResults([]);
			return;
		}
		const response = await axios.get(
			`/api/autocomplete?filter=${searchTerm}`
		);
		console.log(response.data);
		setResults(response.data);
	};

	const debouncedAutoCompleteCities = useDebounce(autoCompleteCities, 110);
	console.log(results.length);

	return (
		<>
			<SearchInput
				initQuery={initQuery}
				onChange={debouncedAutoCompleteCities}
			/>
			{results.length > 0 && (
				<ul className="bg-neutral-100 rounded-lg w-full max-h-80 overflow-y-auto list">
					{results.map((item) => {
						return (
							<li
								key={item.id}
								onClick={(_e) => {
									setResults([]);
									onSelectedCity(item);
								}}
								className="pl-6 group pt-3 pb-3 first:rounded-t-lg cursor-pointer hover:bg-lightGreen border-b border-gray-200 last:border-0 flex items-center gap-4"
							>
								<div className="select-none">
									{item.exists ? "🦊" : "　"}
								</div>
								<div>
									<div className="flex gap-2 items-baseline">
										<div>{item.name}</div>
										<div className="text-neutral-500">
											({item.stateCode})
										</div>
									</div>

									<p className="p-0 text-neutral-500">
										{item.postcode.slice(0, 10).join(", ")}
									</p>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</>
	);
}
