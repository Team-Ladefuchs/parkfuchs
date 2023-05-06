"use client";
import parkfuchsLogo from "../public/parkfuchs-lottie.json";
import Lottie from "lottie-react";

export default function Logo() {
	return (
		<Lottie
			animationData={parkfuchsLogo}
			loop={true}
			width={64}
			draggable={false}
			alt="Parkfuchs Logo"
			className="w-16 mt-[-8px]"
		/>
	);
}
