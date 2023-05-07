import banner250eu from "../public/banner/250eu_Footer_1400x500.png";

import Image from "next/image";
import Link from "next/link";

interface Props {
	link: string;
}

export default function Banner({ link }: Props): JSX.Element {
	return (
		<div className="fixed left-0 right-0 bottom-0 bg-green z-10 w-full h-[4.3rem] banner-shadow md:h-[5.0rem]">
			<Link prefetch={false} href={link} target="_blank">
				<Image
					src={banner250eu}
					height={120}
					alt={"thg Banner"}
					className="mx-auto relative bottom-3 max-sm:bottom-[12px]"
				/>
			</Link>
		</div>
	);
}
