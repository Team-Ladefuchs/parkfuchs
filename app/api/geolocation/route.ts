import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function c(request: NextRequest) {
	try {
		const { latitude, longitude } = await request.json();

		if (!latitude || !longitude) {
			return NextResponse.json(
				{
					msg: "missing key latitude or longitude",
				},
				{ status: 400 }
			);
		}
		// radius in meter
		const response = await axios.get(
			encodeURI(
				`https://api.tomtom.com/search/2/reverseGeocode/crossStreet/${latitude},${longitude}.json?limit=1&spatialKeys=false&radius=1500&allowFreeformNewLine=false&view=Unified&key=${process.env.TOMTOM_KEY}`
			)
		);

		if (!response.data.addresses.length) {
			return NextResponse.json(
				{
					msg: `location wth latitude ${latitude}, longitude ${longitude} was not found`,
				},
				{ status: 404 }
			);
		}

		const { address } = response.data.addresses[0];

		return NextResponse.json({
			cityName: address.municipality ?? address.localName,
			postalCode: address.postalCode,
			state: address.countrySubdivision,
			community: address.countrySecondarySubdivision,
		});
	} catch (error) {
		NextResponse.json(
			{
				msg: "internal server error",
			},
			{ status: 500 }
		);
		console.error("[geolocation]", error);
	}
}
