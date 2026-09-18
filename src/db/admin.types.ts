import { type CityRepo, type Website } from "@/db/types";

export type ModerationStatus =
	| "pending"
	| "approved"
	| "merged"
	| "rejected";

export interface TicketValues {
	information: string;
	website: string | null;
	parkingHours: number;
	useBusLane: boolean;
	untilMaxMarkingHour: boolean;
	freeParking: boolean;
	withEMark: boolean;
	parkingDisk: boolean;
	nonePrivileges: boolean;
	whileCharging: boolean;
	websiteExtras: Array<Website>;
}

export interface AdminTicket {
	id: string;
	created: string;
	updated: string;
	approved: boolean;
	status: ModerationStatus;
	type: "new" | "correction";
	city: CityRepo | null;
	currentCity: AdminTicket | null;
	values: TicketValues;
	reviewedAt: string | null;
	reviewedBy: string | null;
	reviewNote: string | null;
	relatedTickets: Array<RelatedTicket>;
}

export interface RelatedTicket {
	id: string;
	created: string;
	status: ModerationStatus;
	type: "new" | "correction";
}

export interface TicketListResult {
	items: Array<AdminTicket>;
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
}

export interface TicketQuery {
	page?: number;
	perPage?: number;
	query?: string;
	status?: "pending" | "resolved" | "all";
}
