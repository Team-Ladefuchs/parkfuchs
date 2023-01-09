import parkfuchsLogo from "../public/parkfuchs-lottie.json";
import Lottie from "lottie-react";
import Link from "next/link";

import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const bunqLink = "https://bunq.me/parkfuchs";

export default function AppNav() {
	return (
		<nav
			className="p-3 w-device sticky top-0 left-0 right-0 bg-green w-full z-20 max-md:py-2 max-md:px-4"
			role="banner"
		>
			<div className="flex items-center justify-between mx-auto w-[750px] max-md:w-full select-none">
				<Link className="flex gap-2" href="/">
					<Lottie
						animationData={parkfuchsLogo}
						loop={true}
						width={64}
						draggable={false}
						alt="Parkfuchs Logo"
						className="w-16 mt-[-8px]"
					/>
					<div>
						<h1
							className="font-extrabold sm:text-md text-red text-[26px] leading-9 line max-md:text-2xl break-words uppercase roboto-900"
							role="heading"
						>
							Parkfuchs
						</h1>
						<h2 className="mt-[-3px] bitter-500" role="heading">
							Einfach schlau parken.
						</h2>
					</div>
				</Link>
				<Link
					className="bg-darkGreen font-semibold tracking-wider text-xs p-2 px-3 pt-[10px] rounded-lg uppercase hover:opacity-75 flex gap-2 max-md:hidden items-center"
					target="_blank"
					href={bunqLink}
				>
					<FontAwesomeIcon
						icon={faMugHot}
						className="mirror h-4 w-4 mb-[5px]"
					/>
					Danke sagen
				</Link>
			</div>
		</nav>
	);
}
