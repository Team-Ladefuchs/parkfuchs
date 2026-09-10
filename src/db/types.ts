import { z } from "zod";

export const websiteSchema = z.object({
	label: z.string().optional(),
	url: z.string().optional(),
});

export const cityRepoSchema = z.object({
	id: z.string(),
	name: z.string(),
	community: z.string(),
	postcodes: z.array(z.string()),
	state: z.string(),
	stateCode: z.string(),
	latitude: z.string(),
	longitude: z.string(),
});

export const newCitySchema = z.object({
	city: z.string(),
	information: z.string(),
	website: z.string().nullable(),
	parkingHours: z.number(),
	useBusLane: z.boolean(),
	untilMaxMarkingHour: z.boolean(),
	freeParking: z.boolean(),
	withEMark: z.boolean(),
	parkingDisk: z.boolean(),
	nonePrivileges: z.boolean(),
	whileCharging: z.boolean(),
	currentCity: z.string().nullish(),
	websiteExtras: z.array(websiteSchema),
});

// Shape of a `cityInbox` record exactly as PocketBase returns it (and thus
// the wire format of the public `GET /api/city` endpoint): the expanded city
// lives under `expand.city`, there is no `cityRef` yet.
export const rawCitySchema = newCitySchema.extend({
	id: z.string(),
	approved: z.boolean(),
	updated: z.string(),
	expand: z.object({ city: cityRepoSchema.nullish() }).nullish(),
});

export type Website = z.infer<typeof websiteSchema>;

export type CityRepo = z.infer<typeof cityRepoSchema>;

export type NewCity = z.infer<typeof newCitySchema>;

export type RawCity = z.infer<typeof rawCitySchema>;

// A raw record after `toRecordToInboxCity` joined in the city repo.
export interface InboxCity extends RawCity {
	readonly cityRef: CityRepo;
}

// Shared contract for the public `GET /api/city` endpoint. Both the server
// route and client consumers use this type so the response stays in sync.
export type CityApiResponse = Array<RawCity>;

export interface HttpError {
	message: string;
	status: number;
}

export interface CityStats {
	count: number;
	countWithPrivileges: number;
}

export interface ResultCity {
	readonly id: string;
	readonly name: string;
	readonly stateCode: string;
	readonly state: string;
	readonly postcode: Array<string>;
	readonly exists: boolean;
}

export interface Config {
	readonly field: string;
	readonly value: string;
}
