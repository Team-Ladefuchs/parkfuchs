import { faMugHot, faTreeCity } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type JSX } from "react";
import { bunqLink } from "@/components/AppNav";
import { type CityStats } from "@/db/types";

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
			className={`bg-green-normal rounded-lg p-4 px-6 h-fit opacity-75 grid grid-cols-[28px_1fr] gap-2 max-md:gap-3 max-md:gap-y-2 max-md:p-4 ${className}`}
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
				icon={faMugHot}
				className="w-[22px] h-[22px] ml-1 max-md:-mt-px md:hidden!"
			/>
			<a
				className="leading-5 underline md:hidden!"
				href={bunqLink}
				target="_blank"
			>
				Danke sagen.
			</a>
		</section>
	);
}
