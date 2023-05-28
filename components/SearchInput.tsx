import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
	const { searchQuery } = useContext(AppContext);

	const [value, setValue] = useState(searchQuery);

	useEffect(() => {
		setValue(searchQuery ?? "");
	}, [searchQuery]);

	const inputRef = useRef<HTMLInputElement | null>(null);
	return (
		<div className={`relative ${className}`}>
			<input
				ref={inputRef}
				type="text"
				autoComplete="off"
				autoCorrect="off"
				autoFocus
				role="search"
				aria-label="Eingabefeld zum suchen nach einem Ort via Name oder Postleitzahl"
				onChange={(e) => {
					const text = e.target.value;
					onChange(text);
					setValue(text);
				}}
				value={value}
				className="p-2 pl-10 rounded-lg border text-lg border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-green focus:border-green w-full focus:outline-none"
				placeholder="Ort oder Postleitzahl"
			/>
			<FontAwesomeIcon
				icon={faMagnifyingGlass}
				className="w-[17px] h-[17px] absolute left-[0.85rem] top-3.5"
			/>

			{value && (
				<FontAwesomeIcon
					icon={faXmark}
					className="w-5 h-5 absolute right-2.5 top-3.5 cursor-pointer opacity-50"
					onClick={(_e) => {
						onChange("");
						setValue("");
						inputRef.current?.focus();
					}}
				/>
			)}
		</div>
	);
}
