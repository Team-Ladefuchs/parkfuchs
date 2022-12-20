import type { NextApiRequest, NextApiResponse } from "next";
import { saveCity } from "../../db/city";
import { InboxCity, NewCity } from "../../db/types";

interface Data {
	id: string | null;
}

interface Error {
	msg: string;
}

const cityFields = [
	"useBusLane",
	"untilMaxMarkingHour",
	"freeParking",
	"withEMark",
	"cityID",
	"city",
	"information",
	"website",
	"parkingDisk",
	"parkingHours",
	"nonePrivileges",
	"websiteExtras",
];

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
