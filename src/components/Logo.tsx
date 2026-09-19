import { type ComponentType, useEffect, useState } from "react";
import animationData from "@/assets/parkfuchs-lottie.json";

// Cropped to the artwork bounds (union over all frames plus a little padding) so
// the animation fills the same box the static logo used to.
const LOGO_VIEWBOX = "-25.7 109.7 1022.9 814.3";

interface LottieLogoProps {
	src: object;
	autoplay?: boolean;
	loop?: boolean;
	rendererSettings?: {
		viewBoxOnly?: boolean;
		viewBoxSize?: string;
		preserveAspectRatio?: string;
	};
	className?: string;
	role?: string;
	"aria-label"?: string;
}

type LottieLogo = ComponentType<LottieLogoProps>;

interface LogoProps {
	className?: string;
}

export default function Logo({
	className = "w-16 h-[51px] mt-0",
}: LogoProps) {
	const [Lottie, setLottie] = useState<LottieLogo | null>(null);
	const [reduceMotion, setReduceMotion] = useState(false);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduceMotion(media.matches);
		update();
		media.addEventListener("change", update);

		let active = true;
		// Loaded on the client only: lottie-web needs the DOM and has no place in
		// the server bundle. The static SVG covers SSR, no-JS and reduced motion.
		import("lottie-react").then((mod) => {
			if (active) setLottie(() => mod.LottieLight as unknown as LottieLogo);
		});

		return () => {
			active = false;
			media.removeEventListener("change", update);
		};
	}, []);

	if (Lottie && !reduceMotion) {
		// lottie-react styles its own element with `width/height: 100%` in a
		// cascade layer that beats Tailwind utilities, so the size lives on this
		// wrapper and the animation fills it.
		return (
			<span className={`block ${className}`}>
				<Lottie
					src={animationData}
					autoplay
					loop
					rendererSettings={{
						// viewBoxOnly drops the root width/height and translate3d that
						// break small SVG animations on Android and iOS.
						viewBoxOnly: true,
						viewBoxSize: LOGO_VIEWBOX,
						preserveAspectRatio: "xMidYMid meet",
					}}
					role="img"
					aria-label="Parkfuchs Logo"
				/>
			</span>
		);
	}

	return (
		<img
			src="/parkfuchs.svg"
			width={64}
			alt="Parkfuchs Logo"
			className={className}
		/>
	);
}
