import fuchsLog from "../public/parkfuchs.svg";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="h-full grid justify-items-center mt-28 gap-2">
			<Image src={fuchsLog} alt="Parkfuchs logo" height={100} />
			<p className="text-lg">Huch wo sind den wir hier gelandet? </p>
			<Link href="/" className="underline" prefetch={false}>
				Hier geht es entlang
			</Link>
		</div>
	);
}
