import Link from "next/link";
import { JSX } from "react";

interface Props {
	link: string;
}

export default function Banner({ link }: Props): JSX.Element {
	return (
		<div className="fixed left-0 right-0 bottom-0 bg-primaryGreen z-10 w-full h-[4.3rem] banner-shadow md:h-[5.0rem]">
			<Link prefetch={false} href={link} target="_blank">
				<img
					src="https://parkfuchs.app/images/banner/banner_parkfuchs_thg.png"
					alt={"thg Banner"}
					className="mx-auto relative bottom-3 max-sm:bottom-[12px] h-[120px]"
				/>
			</Link>
		</div>
	);
}
