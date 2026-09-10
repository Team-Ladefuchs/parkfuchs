import { useEffect } from "react";
import { type ErrorComponentProps } from "@tanstack/react-router";

export default function ErrorPage({ error, reset }: ErrorComponentProps) {
	useEffect(() => {
		const message = error instanceof Error ? error.message : String(error);
		console.error("500 page [error]", message, error);
	}, [error]);

	return (
		<div className="h-full grid justify-items-center mt-28 gap-3">
			<img src="/parkfuchs.svg" alt="Parkfuchs logo" height={100} />
			<p className="max-w-[28em]">
				Ups, dem Parkfuchs ist ein Fehler unterlaufen! Ein Techniker ist
				bereits informiert.
			</p>
			<button
				className="bg-green-normal max-md:justify-center gap-2 flex items-center text-lg rounded-lg hover:bg-green-dark text-black w-max py-2 px-4 justify-self-start mx-auto"
				onClick={() => reset()}
			>
				Probier es nochmal
			</button>
		</div>
	);
}
