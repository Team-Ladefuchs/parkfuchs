import { StaticImageData } from "next/image";
import banner250eu from "../public/banner/250eu_Footer_1400x500.png";
import banner400eu from "../public/banner/400eu_Footer_1400x500.png";

import Image from "next/image";
import Link from "next/link";

function getBannerImg(): StaticImageData {
	const date = new Date().getFullYear();
	return date === 2022 ? banner400eu : banner250eu;
}

export default function Banner(): JSX.Element {
	return (
		<div className="fixed left-0 right-0 bottom-0 bg-green z-10 w-full h-[5rem] banner-shadow max-md:h-[5.6rem]">
			<Link
				href="https://xn--geld-fr-eauto-1ob.de/ref/Parkfuchs"
				target="_blank"
			>
				<Image
					src={getBannerImg()}
					height={120}
					alt={"thg Banner"}
					className="mx-auto relative bottom-2 max-md:bottom-[11px]"
				/>
			</Link>
		</div>
	);
}
