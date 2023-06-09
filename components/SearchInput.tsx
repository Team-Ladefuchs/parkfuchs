import {
	faMagnifyingGlass,
	faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/appContext";

export interface Properties {
	className?: string;
	onChange: (value: string) => void;
}

export default function SearchInput({
	onChange,
	className = "",
}: Properties): JSX.Element {
	const { searchQuery, setSearchQuery } = useContext(AppContext);
	const [value, setValue] = useState(searchQuery);

	const getLocation = () => {
		if (!navigator.geolocation) {
			return;
		}
		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			try {
				const { data } = await axios.post("/api/geolocation", {
					latitude,
					longitude,
				});

				if (!data) {
					return;
				}

				setSearchQuery(`${data.postalCode}, ${data.cityName}`);
			} catch (error) {
				console.error("[geolocation]", error);
			}
		});
	};

	useEffect(() => {
		setValue(searchQuery ?? "");
		return () => {
			setValue("");
		};
	}, [searchQuery]);

	useEffect(() => {
		onChange(value);
	}, [value]);

	const inputRef = useRef<HTMLInputElement | null>(null);
	return (
		<div className={`relative ${className}`}>
			<FontAwesomeIcon
				icon={faMagnifyingGlass}
				className="w-[17px] h-[17px] absolute left-[0.85rem] top-3.5"
			/>
			<div>
				<input
					ref={inputRef}
					type="type"
					autoComplete="off"
					autoCorrect="off"
					autoFocus
					role="search"
					aria-label="Eingabefeld zum suchen nach einem Ort via Name oder Postleitzahl"
					onChange={(e) => {
						const text = e.target.value;
						setValue(text);
					}}
					value={value}
					className="p-2 pl-10 rounded-lg border text-lg border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-green focus:border-green w-full focus:outline-none"
					placeholder="Ort oder Postleitzahl"
				/>

				<button onClick={() => getLocation()}>
					<FontAwesomeIcon
						icon={faLocationCrosshairs}
						className="w-5 h-5 absolute right-2.5 top-3.5 cursor-pointer"
					/>
				</button>
			</div>
		</div>
	);
}
