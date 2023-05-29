import PocketBase, { RecordService } from "pocketbase";
import type {
	CityRepo,
	CityStats,
	InboxCity,
	NewCity,
	ResultCity,
} from "./types";
import h2p from "html2plaintext";

export const pocketBase = new PocketBase(
	process.env.DB_HOST ?? "http://127.0.0.1:8090"
);

pocketBase.autoCancellation(false);

function toRecordToInboxCity(row: InboxCity): InboxCity {
	const cityItem: CityRepo = row.expand.city as unknown as CityRepo;
	const ret: InboxCity = {
		cityRef: {
			id: cityItem.id,
			name: cityItem.name,
			postcodes: cityItem.postcodes,
			community: cityItem.community,
			state: cityItem.state,
			stateCode: cityItem.stateCode,
		},
		id: row.id,
		city: cityItem.id,
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
				expand: "city",
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
				filter: `approved = true && (city.name ~ '${searchQuery}%' || city.postcodes ~ '${searchQuery}')`,
				expand: "city",
				sort: "-updated,+city",
			});

		return resultList.items.map(toRecordToInboxCity);
	} catch (error) {
		console.error(error);
	}

	return [];
}

export async function getCityCount(): Promise<CityStats> {
	const cityInbox = pocketBase.collection("cityInbox");

	const citiesAll = await cityInbox.getList(1, 1, {
		filter: "approved = true",
	});

	const citiesWithPrivileges = await cityInbox.getList(1, 1, {
		filter: "approved = true && nonePrivileges = false",
	});
	return {
		count: citiesAll.totalItems,
		countWithPrivileges: citiesWithPrivileges.totalItems,
	};
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
		const list = await Promise.all(promises);
		list.sort((a, b) => {
			if (a.exists && !b.exists) {
				return -1;
			}
			if (!a.exists && b.exists) {
				return 1;
			}
			return 0;
		});

		return list;
	} catch (error) {
		console.log(error);
	}

	return [];
}

async function citAlreadyExists(
	cityInbox: RecordService,
	cityId: string
): Promise<boolean> {
	try {
		await cityInbox.getFirstListItem(`city.id="${cityId}"`, {});
		return true;
	} catch (error) {}

	return false;
}

function parseInput(newCity: NewCity): NewCity {
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

export async function saveCity(newCity: NewCity): Promise<InboxCity> {
	const cityToSave = { ...parseInput(newCity), approved: false };
	console.log("saveCity", cityToSave);

	const record = await pocketBase
		.collection("cityInbox")
		.create<InboxCity>(cityToSave);
	return record;
}
