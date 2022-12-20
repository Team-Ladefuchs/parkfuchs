export interface City {
	approved: boolean;
	collectionId: string;
	notes: string;
	collectionName: string;
	created: string;
	id: string;
	isSpam: boolean;
	name: string;
	postcode: number;
	postcodes: Array<number>;
	updated: string;
}

export interface CityRepo {
	id: string;
	name: string;
	community: string;
	created: string;
	latitude: string;
	longitude: string;
	postcodes: String[];
	state: string;
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
	created: string;
	updated: string;
	approved: boolean;
	expand: Expand;
}

export interface NewCity {
	city?: string;
	useBusLane: boolean;
	untilMaxMarkingHour: boolean;
	freeParking: boolean;
	withEMark: boolean;
	cityID: string;
	information: string;
	website: string | null;
	parkingDisk: boolean;
	nonePrivileges: boolean;
	parkingHours: number;
	whileCharging: boolean;
	websiteExtras: Array<Website>;
}

export interface Website {
	label?: string;
	url?: string;
}

export interface ResultCity {
	id: string;
	name: string;
	stateCode: string;
	state: string;
	postcode: number[];
}
