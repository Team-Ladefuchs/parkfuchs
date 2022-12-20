import type { NextApiRequest, NextApiResponse } from "next";
import { saveCity } from "../../db/city";
import { InboxCity, NewCity } from "../../db/types";

interface Data {
	id: string | null;
}

interface Error {
	msg: string;
}

const cityTemplate: NewCity = {
	useBusLane: false,
	untilMaxMarkingHour: false,
	freeParking: false,
	withEMark: false,
	cityID: "",
	city: "",
	information: "",
	website: null,
	parkingDisk: false,
	parkingHours: 2,
	nonePrivileges: false,
	whileCharging: false,
	websiteExtras: [],
};

const cityFields = Object.keys(cityTemplate);

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<Data | Error>
) {
	const { body, method } = request;
	for (const key of Object.keys(body)) {
		if (!cityFields.includes(key)) {
			return response.status(400).json({
				msg: `Missing field ${key}`,
			});
		}
	}
	let row: InboxCity | null = null;
	if (method === "POST") {
		const city = body as NewCity;
		row = await saveCity(city);
	}
	response.status(200).json({ id: row?.id ?? null });
}
