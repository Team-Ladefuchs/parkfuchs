import { StaticImageData } from "next/image";
import banner250eu from "../public/banner/250eu_Footer_1400x500.png";
import banner400eu from "../public/banner/400eu_Footer_1400x500.png";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { link } from "fs";

function getBannerImg(): StaticImageData {
	const date = new Date().getFullYear();
	return date === 2022 ? banner400eu : banner250eu;
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
		useState("max-md:h-[4.5rem]");

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
			className={`fixed left-0 right-0 bottom-0 bg-green z-10 w-full h-[3.85rem] banner-shadow ${mobileWrapperHeight}`}
		>
			<Link href={link} target="_blank">
				<Image
					src={getBannerImg()}
					height={99}
					alt={"thg Banner"}
					className="mx-auto relative bottom-2 max-md:bottom-[10px]"
				/>
			</Link>
		</div>
	);
}
