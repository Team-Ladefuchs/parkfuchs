import type PocketBase from "pocketbase";

import { assertSameOrigin, requireAdminPocketBase } from "@/auth/admin.server";
import {
	type AdminTicket,
	type ModerationStatus,
	type RelatedTicket,
	type TicketListResult,
	type TicketQuery,
	type TicketValues,
} from "@/db/admin.types";
import { type CityRepo, type Website } from "@/db/types";

interface PocketBaseTicketRecord extends TicketValues {
	id: string;
	created: string;
	updated: string;
	approved: boolean;
	city: string;
	currentCity?: string | null;
	moderationStatus?: ModerationStatus;
	reviewedAt?: string | null;
	reviewedBy?: string | null;
	reviewNote?: string | null;
	expand?: {
		city?: CityRepo;
		currentCity?: PocketBaseTicketRecord;
	};
}

const editableFields: Array<keyof TicketValues> = [
	"information",
	"website",
	"parkingHours",
	"useBusLane",
	"untilMaxMarkingHour",
	"freeParking",
	"withEMark",
	"parkingDisk",
	"nonePrivileges",
	"whileCharging",
	"websiteExtras",
];

function getStatus(record: PocketBaseTicketRecord): ModerationStatus {
	// Empty status means a public submission that never had one written; the
	// public API cannot write hidden fields and select fields have no default.
	if (record.moderationStatus) {
		return record.moderationStatus;
	}

	return record.approved ? "approved" : "pending";
}

function getValues(record: PocketBaseTicketRecord): TicketValues {
	return {
		information: record.information ?? "",
		website: record.website ?? null,
		parkingHours: record.parkingHours ?? 0,
		useBusLane: record.useBusLane ?? false,
		untilMaxMarkingHour: record.untilMaxMarkingHour ?? false,
		freeParking: record.freeParking ?? false,
		withEMark: record.withEMark ?? false,
		parkingDisk: record.parkingDisk ?? false,
		nonePrivileges: record.nonePrivileges ?? false,
		whileCharging: record.whileCharging ?? false,
		websiteExtras: record.websiteExtras ?? [],
	};
}

function toTicket(record: PocketBaseTicketRecord): AdminTicket {
	const currentCity = record.expand?.currentCity;

	return {
		id: record.id,
		created: record.created,
		updated: record.updated,
		approved: record.approved,
		status: getStatus(record),
		type: record.currentCity ? "correction" : "new",
		city: record.expand?.city ?? null,
		currentCity: currentCity ? toTicket(currentCity) : null,
		values: getValues(record),
		reviewedAt: record.reviewedAt ?? null,
		reviewedBy: record.reviewedBy ?? null,
		reviewNote: record.reviewNote ?? null,
		relatedTickets: [],
	};
}

function clampPage(value: number | undefined, fallback: number) {
	return Math.max(1, Math.floor(value ?? fallback));
}

function getFilter(
	pocketBase: Awaited<ReturnType<typeof requireAdminPocketBase>>["pocketBase"],
	query: TicketQuery,
) {
	const status = query.status ?? "pending";
	const filters: Array<string> = [];

	// Public submissions leave `moderationStatus` empty: the field is hidden
	// (so unauthenticated clients cannot write it) and PocketBase ignores a
	// `default` on select fields. Empty therefore means pending.
	if (status === "pending") {
		filters.push("(moderationStatus = \"pending\" || moderationStatus = \"\")");
	} else if (status === "resolved") {
		filters.push("reviewedAt != \"\"");
	} else {
		filters.push("(moderationStatus = \"pending\" || moderationStatus = \"\" || reviewedAt != \"\")");
	}

	if (query.query?.trim()) {
		filters.push(
			pocketBase.filter(
				"(city.name ~ {:query} || city.postcodes ~ {:query})",
				{ query: query.query.trim() },
			),
		);
	}

	return filters.join(" && ") || "id != \"\"";
}

async function fetchTicketList(
	pocketBase: PocketBase,
	page: number,
	perPage: number,
	filter: string,
): Promise<TicketListResult> {
	const result = await pocketBase
		.collection("cityInbox")
		.getList<PocketBaseTicketRecord>(page, perPage, {
			filter,
			expand: "city,currentCity,currentCity.city",
			sort: "-created",
		});

	return {
		items: result.items.map(toTicket),
		page: result.page,
		perPage: result.perPage,
		totalItems: result.totalItems,
		totalPages: result.totalPages,
	};
}

async function getTicketsWithMigrationFallback(
	query: TicketQuery,
): Promise<TicketListResult> {
	const { pocketBase } = await requireAdminPocketBase();
	const page = clampPage(query.page, 1);
	const perPage = Math.min(50, Math.max(1, clampPage(query.perPage, 20)));

	try {
		return await fetchTicketList(pocketBase, page, perPage, getFilter(pocketBase, query));
	} catch {
		// Fallback for databases without the moderation migration applied yet.
		return fetchTicketList(pocketBase, page, perPage, "approved = false");
	}
}

export async function listTickets(query: TicketQuery = {}) {
	return getTicketsWithMigrationFallback(query);
}

async function fetchRelatedRecords(
	pocketBase: PocketBase,
	cityId: string,
	ticketId: string,
	statusCondition: string,
): Promise<Array<PocketBaseTicketRecord>> {
	const filter = pocketBase.filter(
		`city = {:city} && id != {:ticket} && ${statusCondition}`,
		{ city: cityId, ticket: ticketId },
	);
	const result = await pocketBase
		.collection("cityInbox")
		.getList<PocketBaseTicketRecord>(1, 10, { filter, sort: "-created" });
	return result.items;
}

async function fetchPendingRelatedRecords(
	pocketBase: PocketBase,
	cityId: string,
	ticketId: string,
): Promise<Array<PocketBaseTicketRecord>> {
	try {
		return await fetchRelatedRecords(pocketBase, cityId, ticketId, "(moderationStatus = \"pending\" || moderationStatus = \"\")");
	} catch {
		// Fallback for databases without the moderation migration applied yet.
		return fetchRelatedRecords(pocketBase, cityId, ticketId, "approved = false");
	}
}

export async function getTicket(ticketId: string) {
	const { pocketBase } = await requireAdminPocketBase();
	const ticket = await pocketBase
		.collection("cityInbox")
		.getOne<PocketBaseTicketRecord>(ticketId, {
			expand: "city,currentCity,currentCity.city",
		});

	const adminTicket = toTicket(ticket);
	const relatedRecords = await fetchPendingRelatedRecords(
		pocketBase,
		ticket.city,
		ticket.id,
	);

	const relatedTickets: Array<RelatedTicket> = relatedRecords.map((record) => ({
		id: record.id,
		created: record.created,
		status: getStatus(record),
		type: record.currentCity ? "correction" : "new",
	}));

	return { ...adminTicket, relatedTickets };
}

async function getMutableTicket(
	pocketBase: Awaited<ReturnType<typeof requireAdminPocketBase>>["pocketBase"],
	ticketId: string,
) {
	return pocketBase
		.collection("cityInbox")
		.getOne<PocketBaseTicketRecord>(ticketId, {
			expand: "city,currentCity,currentCity.city",
		});
}

function valuesPayload(values: TicketValues) {
	return Object.fromEntries(
		editableFields.map((field) => [field, values[field]]),
	);
}

function assertCurrentVersion(actual: string, expected: string) {
	if (actual !== expected) {
		throw new Error("CONFLICT");
	}
}

function assertPending(ticket: PocketBaseTicketRecord) {
	if (ticket.approved || getStatus(ticket) !== "pending") {
		throw new Error("TICKET_RESOLVED");
	}
}

export async function approveNewTicket(input: {
	ticketId: string;
	expectedUpdated: string;
	values: TicketValues;
	note?: string;
}) {
	assertSameOrigin();
	const { pocketBase, admin } = await requireAdminPocketBase();
	const ticket = await getMutableTicket(pocketBase, input.ticketId);

	assertPending(ticket);
	assertCurrentVersion(ticket.updated, input.expectedUpdated);

	if (ticket.currentCity) {
		throw new Error("CORRECTION_REQUIRES_MERGE");
	}

	return pocketBase.collection("cityInbox").update<PocketBaseTicketRecord>(
		input.ticketId,
		{
			...valuesPayload(input.values),
			approved: true,
			moderationStatus: "approved",
			reviewedAt: new Date().toISOString(),
			reviewedBy: admin.email,
			reviewNote: input.note?.trim() || "",
		},
	);
}

export async function rejectTicket(input: {
	ticketId: string;
	expectedUpdated: string;
	note?: string;
}) {
	assertSameOrigin();
	const { pocketBase, admin } = await requireAdminPocketBase();
	const ticket = await getMutableTicket(pocketBase, input.ticketId);

	assertPending(ticket);
	assertCurrentVersion(ticket.updated, input.expectedUpdated);

	return pocketBase.collection("cityInbox").update<PocketBaseTicketRecord>(
		input.ticketId,
		{
			approved: false,
			moderationStatus: "rejected",
			reviewedAt: new Date().toISOString(),
			reviewedBy: admin.email,
			reviewNote: input.note?.trim() || "",
		},
	);
}

export async function mergeCorrection(input: {
	ticketId: string;
	expectedTicketUpdated: string;
	expectedCityUpdated: string;
	values: TicketValues;
	note?: string;
}) {
	assertSameOrigin();
	const { pocketBase, admin } = await requireAdminPocketBase();
	const ticket = await getMutableTicket(pocketBase, input.ticketId);

	assertPending(ticket);
	assertCurrentVersion(ticket.updated, input.expectedTicketUpdated);

	if (!ticket.currentCity) {
		throw new Error("NEW_CITY_REQUIRES_APPROVAL");
	}

	const city = await pocketBase
		.collection("cityInbox")
		.getOne<PocketBaseTicketRecord>(ticket.currentCity);

	if (!city.approved) {
		throw new Error("TARGET_CITY_NOT_APPROVED");
	}

	assertCurrentVersion(city.updated, input.expectedCityUpdated);

	const batch = pocketBase.createBatch();
	batch.collection("cityInbox").update(city.id, valuesPayload(input.values));
	batch.collection("cityInbox").update(ticket.id, {
		approved: false,
		moderationStatus: "merged",
		reviewedAt: new Date().toISOString(),
		reviewedBy: admin.email,
		reviewNote: input.note?.trim() || "",
	});

	await batch.send();
}
