import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JSX } from "react";
import { UseFormRegister } from "react-hook-form";

export const webKeyPattern = "website-extra-";

interface Props {
	isDisabled: boolean;
	registerFn: UseFormRegister<any>;
	showPlus: boolean;
	fieldName: string;
	addMoreField: () => void;
}

export default function WebsiteAddField({
	isDisabled = true,
	registerFn,
	showPlus = false,
	fieldName,
	addMoreField,
}: Props): JSX.Element {
	return (
		<div className="relative block">
			<input
				aria-label="Quelle URL Eingabefeld"
				className={`bg-neutral-100 border border-green text-gray-900 rounded-lg block w-full p-2.5 focus:bg-white focus:border-green focus:outline-none focus:ring-2 focus:ring-green  focus:border-transparent ${
					showPlus ? "pr-12" : ""
				}`}
				placeholder="https://strassenverkehrsamt.de"
				id="website"
				type="url"
				{...registerFn(fieldName)}
			/>
			{showPlus && (
				<button
					disabled={isDisabled}
					className="p-2 rounded-md disabled:opacity-30 absolute top-2 bottom-2 right-[10px] bg-neutral-300 disabled:bg-neutral-200 flex items-center "
					onClick={(e) => {
						e.preventDefault();
						addMoreField();
					}}
				>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			)}
		</div>
	);
}
