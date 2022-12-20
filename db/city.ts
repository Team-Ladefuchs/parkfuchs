import PocketBase from "pocketbase";
import type { InboxCity, NewCity, ResultCity } from "./types";
import h2p from "html2plaintext";

const pocketBase = new PocketBase(
	process.env.DB_HOST ?? "http://127.0.0.1:8090"
);

export async function getNewestEnabledInboxCities(
	maxResults: number
): Promise<InboxCity[]> {
	try {
		const resultList = await pocketBase
			.collection("cityInbox")
			.getList(1, maxResults, {
				filter: "approved = true",
				expand: "cityID",
				sort: "-updated,city",
			});

		return resultList.items.map((row) => {
			return {
				...row,
			} as unknown as InboxCity;
		});
	} catch (error) {
		console.error(error);
	}

	return [];
}

export async function search(
	query: string,
	maxResults: number
): Promise<InboxCity[]> {
	try {
		const searchQuery = query ?? "";

		const resultList = await pocketBase
			.collection("cityInbox")
			.getList(1, maxResults, {
				filter: `approved = true && (cityID.name ~ '${searchQuery}%' || cityID.postcodes ~ '${searchQuery}')`,
				expand: "cityID",
				sort: "-updated,+city",
			});

		return resultList.items.map((row) => {
			return {
				...row,
			} as unknown as InboxCity;
		});
	} catch (error) {
		console.error(error);
	}

	return [];
}

export async function autocomplete(
	query: string,
	maxResults: number
): Promise<ResultCity[]> {
	try {
		const searchQuery = query ?? "";
		const results = await pocketBase
			.collection("cityRepo")
			.getList(1, maxResults, {
				filter: `name ~ '${searchQuery}%' || postcodes ~ '${searchQuery}'`,
				sort: "+name",
			});

		return results.items.map((row) => {
			return {
				id: row.id,
				name: row.name,
				postcode: row.postcodes,
				stateCode: row.stateCode,
				state: row.state,
			};
		});
	} catch (error) {
		console.log(error);
	}

	return [];
}

export async function saveCity(newCity: NewCity): Promise<InboxCity> {
	const city = {
		...newCity,
		information: h2p(newCity.information.trim()),
		approved: false,
		parkingHours:
			newCity.untilMaxMarkingHour || !newCity.freeParking
				? 0
				: newCity.parkingHours,
	};
	console.log("saveCity", { ...city });

	const record = await pocketBase
		.collection("cityInbox")
		.create<InboxCity>(city);
	return record;
}
