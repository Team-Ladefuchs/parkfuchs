import Image from "next/image";
import parkfuchsLogo from "../public/parkfuchs.svg";

export default function Logo() {
	return (
		// <Lottie
		// 	animationData={parkfuchsLogo}
		// 	loop={true}
		// 	width={64}
		// 	draggable={false}
		// 	alt="Parkfuchs Logo"
		// 	className="w-16 mt-[-8px]"
		// />
		<Image
			src={parkfuchsLogo}
			width={64}
			alt="Parkfuchs Logo"
			className="w-16 mt-[-8px]"
		/>
	);
}
