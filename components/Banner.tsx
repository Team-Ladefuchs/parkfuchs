import { StaticImageData } from "next/image";
import banner250eu from "../public/banner/250eu_Footer_1400x500.png";
import banner400eu from "../public/banner/400eu_Footer_1400x500.png";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function getBannerImg(): StaticImageData {
	return banner250eu;
}

function runningStandalone(): boolean {
	if (window.navigator["standalone"] === true) {
		return true;
	}

	return window.matchMedia("(display-mode: standalone)").matches;
}

interface Props {
	link: string;
}

export default function Banner({ link }: Props): JSX.Element {
	const [mobileWrapperHeight, setMobileWrapperHeight] =
		useState("max-md:h-[5.0rem]");

	useEffect(() => {
		if (!window) {
			return;
		}
		if (!runningStandalone()) {
			setMobileWrapperHeight("");
		}
	}, []);
	return (
		<div
			className={`fixed left-0 right-0 bottom-0 bg-green z-10 w-full h-[4.5rem] banner-shadow ${mobileWrapperHeight}`}
		>
			<Link href={link} target="_blank">
				<Image
					src={getBannerImg()}
					height={120}
					alt={"thg Banner"}
					className="mx-auto relative bottom-3 max-md:bottom-[12px]"
				/>
			</Link>
		</div>
	);
}
