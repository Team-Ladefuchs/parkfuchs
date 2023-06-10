import {
	faMagnifyingGlass,
	faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
export interface Properties {
	className?: string;
	onChange: (value: string) => void;
	initValue?: string;
}

export default function SearchInput({
	onChange,
	className = "",
	initValue = "",
}: Properties): JSX.Element {
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = initValue;
		}
	}, [initValue]);

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

				if (inputRef.current) {
					onChange(`${data.postalCode}, ${data.cityName}`);
					inputRef.current.value = `${data.postalCode}, ${data.cityName}`;
				}
			} catch (error) {
				console.error("[geolocation]", error);
			}
		});
	};

	return (
		<div className={`relative ${className}`}>
			<FontAwesomeIcon
				icon={faMagnifyingGlass}
				className="w-[17px] h-[17px] absolute left-[0.85rem] top-3.5"
			/>

			<input
				ref={inputRef}
				type="type"
				autoComplete="off"
				autoCorrect="off"
				autoFocus
				role="search"
				aria-label="Eingabefeld zum suchen nach einem Ort via Name oder Postleitzahl"
				onChange={(e) => {
					onChange(e.target.value);
				}}
				className="p-2 pl-10 rounded-lg border text-lg border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-green focus:border-green w-full focus:outline-none"
				placeholder="Ort oder Postleitzahl"
			/>

			<button>
				<FontAwesomeIcon
					onClick={() => getLocation()}
					icon={faLocationCrosshairs}
					className="w-5 h-5 absolute right-2.5 top-1.5 p-2 cursor-pointer "
				/>
			</button>
		</div>
	);
}
