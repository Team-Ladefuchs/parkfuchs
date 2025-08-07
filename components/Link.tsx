import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { formatLink } from "../functions/utils";
import { JSX } from "react";

export interface Properties {
	link?: string | null;
	label?: string | null;
}

export default function Url({ link, label }: Properties): JSX.Element {
	if (!link) {
		return <div className="hidden"></div>;
	}

	return (
		<Link
			className="underline max-w-xl max-sm:w-[275px] max-xs:[280px] text-red-normal break-words max-md:mb-2 last:mb-0 w-full"
			target="_blank"
			href={link}
		>
			<div className="grid grid-cols-[14px_1fr] gap-2 items-center">
				<FontAwesomeIcon className="h-4 w-4" icon={faLink} />
				<div>{label ? label : formatLink(link)}</div>
			</div>
		</Link>
	);
}
