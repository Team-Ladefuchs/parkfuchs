import {
	faMagnifyingGlass,
	faLocationCrosshairs,
	faXmark,
	faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JSX, useEffect, useRef } from "react";
import { geolocation } from "../functions/geolocation";

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

	const showClearButton = inputRef.current && inputRef.current.value.trim();

	useEffect(() => {
		if (!inputRef.current) {
			return;
		}
		if (inputRef.current?.value == initValue) {
			return;
		}

		inputRef.current.value = initValue;
		onChange(initValue);
	}, [initValue]);

	const getLocation = () => {
		if (!navigator.geolocation) {
			return;
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			try {
				const response = await geolocation({
					latitude,
					longitude,
				});

				if (!response) {
					return;
				}

				if (inputRef.current) {
					onChange(`${response.postalCode}, ${response.cityName}`);
					inputRef.current.value = `${response.postalCode}, ${response.cityName}`;
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
				className="w-[18px] h-[18px] absolute left-[0.85rem] top-3.5"
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
				className="p-2 pl-10 pr-16 rounded-lg border text-lg border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-green focus:border-green w-full focus:outline-none"
				placeholder="Ort, PLZ oder lokale Position"
			/>
			{showClearButton && (
				<button className="active:outline-none webkit-highlight-fix">
					<FontAwesomeIcon
						onClick={() => {
							if (!inputRef.current) {
								return;
							}
							inputRef.current.value = "";
							onChange("");
						}}
						icon={faXmark}
						size="lg"
						className="absolute w-5 h-5 right-1 top-[5px] p-2 cursor-pointer"
					/>
				</button>
			)}
			{!showClearButton && (
				<>
					<FontAwesomeIcon
						icon={faArrowRight}
						size="lg"
						bounce={true}
						className="absolute right-[38px] w-5 h-5 top-[13px] text-[rgb(170,170,170)] animate-bounceX active:outline-none webkit-highlight-fix"
					/>

					<button className="active:outline-none webkit-highlight-fix">
						<FontAwesomeIcon
							onClick={() => getLocation()}
							icon={faLocationCrosshairs}
							size="lg"
							className="absolute right-1 w-5 h-5 top-[5px] p-2 cursor-pointer"
						/>
					</button>
				</>
			)}
		</div>
	);
}
