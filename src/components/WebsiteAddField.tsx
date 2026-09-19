import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type JSX } from "react";
import { type UseFormRegister } from "react-hook-form";

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
					type="button"
					aria-label="Weitere Quelle hinzufügen"
					disabled={isDisabled}
					className="absolute top-2 right-[10px] bottom-2 inline-flex items-center justify-center rounded-md border border-gray-400 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-darker disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
					onClick={(e) => {
						e.preventDefault();
						addMoreField();
					}}
				>
					<FontAwesomeIcon aria-hidden="true" icon={faPlus} />
				</button>
			)}
		</div>
	);
}
