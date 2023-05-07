import { faSlack } from "@fortawesome/free-brands-svg-icons";
import { faMugHot, faTreeCity } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { CityStats } from "../db/types";
import { bunqLink } from "./AppNav";

interface Properties {
	className?: string;
	hidden: boolean;
	cityStats: CityStats;
}

export default function LandingBox({
	className = "",
	hidden = false,
	cityStats,
}: Properties): JSX.Element {
	if (hidden) {
		return <></>;
	}
	return (
		<section
			className={`bg-green rounded-lg p-6 h-fit opacity-75 grid grid-cols-[28px_1fr] gap-2 max-md:gap-3 max-md:gap-y-2 max-md:p-5 ${className}`}
		>
			<FontAwesomeIcon
				icon={faTreeCity}
				className="w-5 h-5 max-md:h-7 max-md:w-7 mt-[2px] ml-[-3px]"
			/>
			<p>
				Für E-Autos gibt’s Privilegien in{" "}
				{cityStats.countWithPrivileges} von insgesamt {cityStats.count}{" "}
				eingetragenen Städten.
			</p>
			<FontAwesomeIcon
				icon={faSlack}
				className="w-5 h-5 max-md:h-6 max-md:w-6"
			/>
			<p className="lg:ml-[-2px] max-md:block pb-1">
				Feedback und Ideen:
				<Link
					prefetch={false}
					href="https://parkfuchs.app/slack"
					target="_blank"
					className="ml-1 underline"
				>
					hier entlang!
				</Link>
			</p>
			<FontAwesomeIcon
				icon={faMugHot}
				className="w-[22px] h-[22px] ml-1 max-md:mt-[-1px] md:hidden"
			/>
			<Link
				className="leading-5 underline md:hidden"
				href={bunqLink}
				prefetch={false}
			>
				Danke sagen.
			</Link>
		</section>
	);
}
