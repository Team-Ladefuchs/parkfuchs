import PocketBase, { type RecordService } from "pocketbase";
import h2p from "html2plaintext";

import { type CityRepo, type CityStats, type InboxCity, type NewCity, type RawCity, type ResultCity } from "@/db/types";

let pbInstance: PocketBase | null = null;

export async function pocketBaseInstance() {
	if (pbInstance) {
		return pbInstance;
	}
	const dbHost = process.env.DB_HOST ?? "http://127.0.0.1:8090";
	console.log("Using (DB_HOST) for pocketbase:", dbHost);
	pbInstance = new PocketBase(dbHost);
	pbInstance.autoCancellation(true);
	return pbInstance;
}

function toRecordToInboxCity(row: RawCity): InboxCity {
	const cityItem = row.expand?.city;

	if (!cityItem) {
		throw new Error(
			`[toRecordToInboxCity] city expansion missing for record ${row.id}`
		);
	}

	return {
		...row,
		cityRef: cityItem,
		id: row.id,
		city: cityItem.id,
	};
}

function parseSearch(
	searchQuery: string
): null | { postcode: string; cityName: string } {
	const parts = searchQuery.split(",");

	if (parts.length > 1) {
		return {
			postcode: parts[0]?.trim() ?? "",
			cityName: parts[1]?.trim() ?? "",
		};
	}

	return null;
}

export async function getEnabledInboxCities(
	maxResults = 16
): Promise<Array<InboxCity>> {
	try {
		const pocketBase = await pocketBaseInstance();
		const resultList = await pocketBase
			.collection("cityInbox")
			.getList<RawCity>(1, maxResults, {
				filter: "approved = true",
				expand: "city",
				sort: "-updated,city",
			});
		return resultList.items.map(toRecordToInboxCity);
	} catch (error: Error | any) {
		console.error("[getNewestEnabledInboxCities]", error.message);
	}

	return [];
}

export async function getCityById(cityId: string): Promise<InboxCity | null> {
	try {
		const pocketBase = await pocketBaseInstance();
		const result = await pocketBase
			.collection("cityInbox")
			.getFirstListItem<RawCity>(
				`city.id="${cityId}" && approved = true`,
				{
					expand: "city",
				}
			);

		if (!result.approved) {
			return null;
		}
		return toRecordToInboxCity(result);
	} catch (error: Error | any) {
		console.error("[getCityById]", error.message);
	}

	return null;
}
export async function getCitiesWithPrivileges(): Promise<Array<RawCity>> {
	try {
		const pocketBase = await pocketBaseInstance();
		return await pocketBase.collection("cityInbox").getFullList<RawCity>({
			filter: `approved=true &&  
						(freeParking = true ||
						parkingHours > 0 ||
						untilMaxMarkingHour = true ||
						useBusLane = true)
				`,
			expand: "city",
		});
	} catch (error: Error | any) {
		console.error("[getCityById]", error.message);
	}

	return [];
}

export async function search(
	query: string,
	maxResults: number
): Promise<Array<InboxCity>> {
	try {
		const searchQuery = query ?? "";

		const complexQuery = parseSearch(searchQuery);
		const pocketBase = await pocketBaseInstance();

		const collection = pocketBase.collection("cityInbox");

		if (complexQuery) {
			const { postcode, cityName } = complexQuery;
			const resultList = await collection?.getList<RawCity>(
				1,
				maxResults,
				{
					filter: `approved = true && (city.name ~ '${cityName}%' && city.postcodes ~ '${postcode}')`,
					expand: "city",
					sort: "-updated,+city",
				}
			);
			return resultList?.items
				.map(toRecordToInboxCity)
				.filter((item) => item.approved);
		}

		const resultList = await collection.getList<RawCity>(1, maxResults, {
			filter: `approved = true && (city.name ~ '${searchQuery.trim()}%' || city.postcodes ~ '${searchQuery}')`,
			expand: "city",
			sort: "-updated,+city",
		});

		return resultList.items
			.map(toRecordToInboxCity)
			.filter((item) => item.approved);
	} catch (error: Error | any) {
		console.error("[search]", error.message);
	}

	return [];
}

export async function getCityCount(): Promise<CityStats> {
	try {
		const pocketBase = await pocketBaseInstance();
		const collection = pocketBase.collection("statistic");

		const result = await collection.getList<{ id: number; total: number }>(
			1,
			1
		);
		const { id, total } = result.items[0] ?? { id: 0, total: 0 };

		return {
			count: total,
			countWithPrivileges: id,
		};
	} catch (error) {
		return {
			count: 0,
			countWithPrivileges: 0,
		};
	}
}

export async function autocomplete(
	query: string,
	maxResults: number
): Promise<Array<ResultCity>> {
	try {
		const searchQuery = query?.trim() || "";
		const pocketBase = await pocketBaseInstance();
		const collection = pocketBase.collection("cityRepo");
		const complexQuery = parseSearch(searchQuery);
		const filter = complexQuery
			? createComplexFilter(complexQuery)
			: createSimpleFilter(searchQuery);

		const results = await collection.getList(1, maxResults, { filter });
		const cityInbox = pocketBase.collection("cityInbox");

		const cities = await Promise.all(
			results.items.map((row) => createCityResult(row, cityInbox))
		);
		return cities;
	} catch (error: Error | any) {
		return [];
	}
}

function createComplexFilter({
	postcode,
	cityName,
}: {
	postcode: string;
	cityName: string;
}): string {
	return `name ~ '${cityName}%' && postcodes ~ '${postcode}'`;
}

function createSimpleFilter(searchQuery: string): string {
	return `name ~ '${searchQuery}%' || postcodes ~ '${searchQuery}'`;
}

async function createCityResult(row: any, cityInbox: any): Promise<ResultCity> {
	const exists = await citAlreadyExists(cityInbox, row.id);
	return {
		id: row.id,
		name: row.name,
		postcode: row.postcodes,
		stateCode: row.stateCode,
		state: row.state,
		exists,
	};
}

async function citAlreadyExists(
	cityInbox: RecordService,
	cityId: string
): Promise<boolean> {
	try {
		await cityInbox.getFirstListItem(
			`city.id="${cityId}" && approved=true`,
			{
				fields: "city",
			}
		);
		return true;
	} catch (error: Error | any) {}

	return false;
}

async function parseInput(newCity: NewCity): Promise<NewCity> {
	const information = h2p(newCity.information.trim());

	if (newCity.nonePrivileges) {
		return {
			...newCity,
			information,
			parkingHours: 0,
			freeParking: false,
			withEMark: false,
			useBusLane: false,
			whileCharging: false,
			currentCity: newCity.currentCity,
			untilMaxMarkingHour: false,
		};
	}

	const parkingHours = newCity.untilMaxMarkingHour ? 0 : newCity.parkingHours;

	const untilMaxMarkingHour =
		newCity.freeParking && newCity.whileCharging && parkingHours === 0
			? true
			: newCity.untilMaxMarkingHour;

	return {
		...newCity,
		information,
		parkingHours,
		untilMaxMarkingHour,
	};
}

export async function saveCity(newCity: NewCity): Promise<RawCity> {
	// `moderationStatus` is a hidden, superuser-only field; the collection's
	// field default ("pending") applies it on public creates.
	const cityToSave = {
		...(await parseInput(newCity)),
		approved: false,
	};

	const pocketBase = await pocketBaseInstance();
	const record = await pocketBase
		.collection("cityInbox")
		.create<RawCity>(cityToSave);
	return record;
}
