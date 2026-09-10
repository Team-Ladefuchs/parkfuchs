import { createServerFn } from "@tanstack/react-start";
import axios, { type AxiosError } from "axios";

export const geolocation = createServerFn({ method: "GET" })
	.validator((data: { latitude: number; longitude: number }) => data)
	.handler(async ({ data }) => {
		const { latitude, longitude } = data;
		// radius in meter
		try {
			const { data: response } = await axios.get(
				`https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?limit=1&spatialKeys=false&radius=1300&allowFreeformNewLine=false&view=Unified&key=${process.env.TOMTOM_KEY}`
			);

			if (!response.addresses.length) {
				return null;
			}

			const { address } = response.addresses[0];

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
	});
