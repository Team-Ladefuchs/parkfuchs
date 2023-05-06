import { NextRequest, NextResponse } from "next/server";
import { saveCity } from "../../../db/city";
import { InboxCity, NewCity } from "../../../db/types";

const cityTemplate: NewCity = {
	useBusLane: false,
	untilMaxMarkingHour: false,
	freeParking: false,
	withEMark: false,
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

export async function POST(request: NextRequest) {
	const body = await request.json();
	for (const key of Object.keys(body)) {
		if (!cityFields.includes(key)) {
			return NextResponse.json(
				{
					msg: `Missing field ${key}`,
				},
				{
					status: 400,
				}
			);
		}
	}
	let row: InboxCity | null = null;

	const city = body as NewCity;
	row = await saveCity(city);

	return NextResponse.json({ id: row?.id ?? null });
}
