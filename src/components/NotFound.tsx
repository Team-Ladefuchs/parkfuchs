import { Link } from "@tanstack/react-router";

export default function NotFound() {
	return (
		<div className="h-full grid justify-items-center mt-28 gap-2">
			<img src="/parkfuchs.svg" alt="Parkfuchs logo" height={100} />
			<p className="text-lg">Huch wo sind den wir hier gelandet? </p>
			<Link to="/" className="underline">
				Hier geht es entlang
			</Link>
		</div>
	);
}
