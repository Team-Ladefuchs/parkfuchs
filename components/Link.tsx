import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { formatLink } from "../functions/utils";

export interface Properties {
	link?: string | null;
	label?: string | null;
}

export default function Url({ link, label }: Properties): JSX.Element {
	if (!link) {
		return <></>;
	}

	return (
		<div className="grid grid-cols-[14px_1fr] gap-2 items-center text-red break-words w-full max-md:mb-2 last:mb-0">
			<FontAwesomeIcon className="h-4 w-4" icon={faLink} />
			<Link
				className="underline break-words max-w-xl max-sm:w-[275px] max-xs:[280px]"
				target="_blank"
				href={link}
			>
				{label ? label : formatLink(link)}
			</Link>
		</div>
	);
}
