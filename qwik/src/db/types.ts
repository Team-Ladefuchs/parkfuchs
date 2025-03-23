export interface CityRepo {
	readonly id: string;
	readonly name: string;
	readonly community: string;
	readonly postcodes: string[];
	readonly state: string;
	readonly stateCode: string;
	readonly latitude: string;
	readonly longitude: string;
}

export interface Expand {
	cityID: CityRepo;
}

export interface HttpError {
	message: string;
	status: number;
}

export interface InboxCity extends NewCity {
	id: string;
	approved: boolean;
	updated: string;
	cityRef: CityRepo;
	expand?: any;
}

export interface CityStats {
	count: number;
	countWithPrivileges: number;
}

export interface NewCity {
	readonly useBusLane: boolean;
	readonly untilMaxMarkingHour: boolean;
	readonly freeParking: boolean;
	readonly withEMark: boolean;
	readonly city: string;
	readonly information: string;
	readonly website: string | null;
	readonly parkingDisk: boolean;
	readonly nonePrivileges: boolean;
	readonly parkingHours: number;
	readonly whileCharging: boolean;
	readonly currentCity?: string | null;
	readonly websiteExtras: Array<Website>;
}

export interface Website {
	readonly label?: string;
	readonly url?: string;
}

export interface ResultCity {
	readonly id: string;
	readonly name: string;
	readonly stateCode: string;
	readonly state: string;
	readonly postcode: string[];
	readonly exists: boolean;
}

export interface Config {
	readonly field: string;
	readonly value: string;
}
