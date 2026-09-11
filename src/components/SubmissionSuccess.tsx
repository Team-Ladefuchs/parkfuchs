import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type JSX } from "react";

interface Props {
	cityName: string;
	isCorrection: boolean;
	onClose: () => void;
}

export default function SubmissionSuccess({
	cityName,
	isCorrection,
	onClose,
}: Props): JSX.Element {
	return (
		<div className="px-6 py-10 max-md:px-5 text-center">
			<div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-light text-green-dark animate-pop">
				<FontAwesomeIcon icon={faCircleCheck} size="3x" />
			</div>

			<p className="mx-auto max-w-lg text-lg leading-relaxed text-gray-800">
				{isCorrection ? (
					<>
						Deine Meldung zu <b>{cityName}</b> ist sicher im
						Fuchsbau angekommen.
						<br />
						Ein Teammitglied prüft nun, was korrigiert werden muss.
					</>
				) : (
					<>
						Dein Vorschlag für <b>{cityName}</b> ist sicher im
						Fuchsbau angekommen.
						<br />
						Ein Teammitglied schaut nochmal drüber.
						<br />
						Sobald alles passt, erscheint dein Ort im Verzeichnis.
					</>
				)}
			</p>
			<button
				type="button"
				onClick={onClose}
				className="mt-7 rounded-lg bg-green-normal px-6 py-3 font-medium text-black hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-green-dark"
			>
				Alles klar!
			</button>
		</div>
	);
}
