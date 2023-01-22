import PocketBase, { RecordSubscription } from "pocketbase";
import type { CityRepo, InboxCity, NewCity, ResultCity } from "./types";
import h2p from "html2plaintext";

export const pocketBase = new PocketBase(
	process.env.DB_HOST ?? "http://127.0.0.1:8090"
);

function toRecordToInboxCity(row: InboxCity): InboxCity {
	const cityItem: CityRepo = row.expand.cityID as unknown as CityRepo;
	const ret: InboxCity = {
		cityRef: {
			id: cityItem.id,
			name: cityItem.name,
			postcodes: cityItem.postcodes,
			community: cityItem.community,
			latitude: cityItem.latitude,
			longitude: cityItem.longitude,
			state: cityItem.state,
		},
		id: row.id,
		approved: row.approved,
		useBusLane: row.useBusLane,
		untilMaxMarkingHour: row.untilMaxMarkingHour,
		freeParking: row.freeParking,
		withEMark: row.withEMark,
		information: row.information,
		website: row.website,
		parkingDisk: row.parkingDisk,
		nonePrivileges: row.nonePrivileges,
		parkingHours: row.parkingHours,
		whileCharging: row.whileCharging,
		websiteExtras: row.websiteExtras,
	};

	return ret;
}

export async function getNewestEnabledInboxCities(
	maxResults: number
): Promise<InboxCity[]> {
	try {
		const resultList = await pocketBase
			.collection("cityInbox")
			.getList<InboxCity>(1, maxResults, {
				filter: "approved = true",
				expand: "cityID",
				sort: "-updated,city",
			});

		return resultList.items.map(toRecordToInboxCity);
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
			.getList<InboxCity>(1, maxResults, {
				filter: `approved = true && (cityID.name ~ '${searchQuery}%' || cityID.postcodes ~ '${searchQuery}')`,
				expand: "cityID",
				sort: "-updated,+city",
			});

		return resultList.items.map(toRecordToInboxCity);
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

		const cityInbox = pocketBase.collection("cityInbox");

		const promises = results.items.map(async (row) => {
			return {
				id: row.id,
				name: row.name,
				postcode: row.postcodes,
				stateCode: row.stateCode,
				state: row.state,
				exists: await citAlreadyExists(cityInbox, row.id),
			};
		});
		return await Promise.all(promises);
	} catch (error) {
		console.log(error);
	}

	return [];
}

async function citAlreadyExists(
	cityInbox: any,
	cityId: string
): Promise<boolean> {
	try {
		await cityInbox.getFirstListItem(`cityID.id="${cityId}"`, {});
		return true;
	} catch (error) {}

	return false;
}

export async function saveCity(newCity: NewCity): Promise<InboxCity> {
	const parkingHours =
		newCity.nonePrivileges ||
		newCity.untilMaxMarkingHour ||
		!newCity.freeParking
			? 0
			: newCity.parkingHours;

	const untilMaxMarkingHour =
		newCity.freeParking && newCity.whileCharging && parkingHours === 0
			? true
			: newCity.untilMaxMarkingHour;
	const city = {
		...newCity,
		information: h2p(newCity.information.trim()),
		approved: false,
		parkingHours,
		untilMaxMarkingHour,
	};
	console.log("saveCity", { ...city });

	const record = await pocketBase
		.collection("cityInbox")
		.create<InboxCity>(city);
	return record;
}
