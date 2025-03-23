"use server";

import axios, { type AxiosError } from "axios";

export async function geolocation({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}) {
	// radius in meter
	try {
		const { data } = await axios.get(
			`https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?limit=1&spatialKeys=false&radius=1300&allowFreeformNewLine=false&view=Unified&key=${process.env.TOMTOM_KEY}`
		);

		if (!data.addresses.length) {
			return null;
		}

		const { address } = data.addresses[0];

		return {
			cityName: address.municipality ?? address.localName,
			postalCode: address.postalCode,
			state: address.countrySubdivision,
			community: address.countrySecondarySubdivision,
		};
	} catch (error: AxiosError | any) {
		console.error(`[geolocation] ${error.message}`);
		return null;
	}
}
