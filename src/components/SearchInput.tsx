import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader2Icon, LocateFixedIcon } from "lucide-react";
import { type JSX, useEffect, useRef, useState } from "react";
import { geolocation } from "@/functions/geolocation.functions";

export interface Properties {
	className?: string;
	onChange: (value: string) => void;
	initValue?: string;
	id: string;
}

export default function SearchInput({
	onChange,
	className = "",
	initValue = "",
	id,
}: Properties): JSX.Element {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isLocating, setIsLocating] = useState(false);

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
		if (!navigator.geolocation || isLocating) {
			return;
		}

		setIsLocating(true);
		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			try {
				const response = await geolocation({
					data: {
						latitude,
						longitude,
					},
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
			} finally {
				setIsLocating(false);
			}
		}, () => setIsLocating(false));
	};

	return (
		<div className={`relative ${className}`}>
			<FontAwesomeIcon
				icon={faMagnifyingGlass}
				className="w-[18px] h-[18px] absolute left-[0.85rem] top-3.5"
			/>

			<input
				ref={inputRef}
				type="text"
				autoComplete="off"
				autoCorrect="off"
				autoFocus
				id={id}
				aria-label="Eingabefeld zum suchen nach einem Ort via Name oder Postleitzahl"
				onChange={(e) => {
					onChange(e.target.value);
				}}
				className="p-2 pl-10 pr-16 rounded-lg border text-lg border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-green-dark focus:border-green-dark w-full focus:outline-none"
				placeholder="Ort, PLZ oder lokale Position"
			/>
			{showClearButton && (
				<button
					className="active:outline-none webkit-highlight-fix"
					aria-label="Eingabefeld leeren"
				>
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
				<button
					type="button"
					disabled={isLocating}
					onClick={getLocation}
					className="webkit-highlight-fix absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-dark disabled:cursor-wait disabled:text-gray-500"
					aria-label={
						isLocating
							? "Aktuelle Position wird ermittelt"
							: "Aktuelle Position verwenden"
					}
				>
					{isLocating ? (
						<Loader2Icon
							aria-hidden="true"
							className="size-5 animate-spin"
						/>
					) : (
						<LocateFixedIcon aria-hidden="true" className="size-5" />
					)}
				</button>
			)}
		</div>
	);
}
