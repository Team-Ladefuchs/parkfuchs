"use client";

import fuchsLog from "../public/parkfuchs.svg";
import Image from "next/image";

import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[error]", error.message, error);
	}, [error]);

	return (
		<div className="h-full grid justify-items-center mt-28 gap-3">
			<Image src={fuchsLog} alt="Parkfuchs logo" height={100} />
			<p className="max-w-[28em]">
				Ups, dem Parkfuchs ist ein Fehler unterlaufen! Ein Techniker ist
				bereits informiert.
			</p>
			<button
				className="bg-green max-md:justify-center gap-2 flex items-center text-lg rounded-lg hover:bg-darkGreen text-black w-max py-2 px-4 justify-self-start mx-auto"
				onClick={() => reset()}
			>
				Probier es nochmal
			</button>
		</div>
	);
}
