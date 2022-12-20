import { faSlack } from "@fortawesome/free-brands-svg-icons";
import {
	faArrowRight,
	faMugHot,
	faSquareParking,
	faTreeCity,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { bunqLink } from "./AppNav";

export default function LandingBox(): JSX.Element {
	return (
		<section className="bg-green rounded-lg mx-auto p-6 mb-6 h-fit opacity-75 grid grid-cols-[28px_1fr] gap-2 max-md:gap-4 max-md:p-5">
			<FontAwesomeIcon
				icon={faTreeCity}
				className="w-5 h-5 max-md:h-7 max-md:w-7 mt-[2px]"
			/>
			<p>
				Mit deinem Elektroauto genießt du in vielen Städten Privilegien.
				<br></br> Nur welche – und wo?
			</p>
			<FontAwesomeIcon
				icon={faSquareParking}
				className="w-5 h-5 max-md:h-6 max-md:w-6 mt-[2px]"
			/>
			<p className="leading-5">
				Hilf der Community!<br></br> Füttere den Fuchs mit Infos aus
				deiner Stadt.
			</p>
			<FontAwesomeIcon
				icon={faSlack}
				className="w-5 h-5 mt-[2px] max-md:h-6 max-md:w-6"
			/>
			<p className="lg:ml-[-2px] max-md:block">
				Sende uns Feedback und Ideen{" "}
				<FontAwesomeIcon
					icon={faArrowRight}
					className="w-[14px] h-[14px] mx-1 inline-block relative bottom-[1px]"
				/>
				<Link
					href="https://parkfuchs.app/slack"
					target="_blank"
					className="ml-1 max-md:ml-0 underline"
				>
					komm in unseren Slack-Channel!
				</Link>
			</p>
			<FontAwesomeIcon
				icon={faMugHot}
				className="w-[22px] h-[22px]  ml-1 mt-[-5px] md:hidden"
			/>
			<Link className="leading-5 underline md:hidden" href={bunqLink}>
				Danke sagen.
			</Link>
		</section>
	);
}
