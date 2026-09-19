import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
	getAdminSession,
	loginAdmin,
	logoutAdmin,
} from "@/auth/admin.server";
import {
	approveNewTicket,
	deleteTicket,
	getTicket,
	listTickets,
	mergeCorrection,
	rejectTicket,
	reopenTicket,
} from "@/db/admin.server";
import { type TicketValues } from "@/db/admin.types";

const websiteSchema = z.object({
	label: z.string().max(100),
	url: z.string().max(2000),
});

const ticketValuesSchema: z.ZodType<TicketValues> = z.object({
	information: z.string().max(10000),
	website: z.string().max(2000).nullable(),
	parkingHours: z.number().min(0).max(24),
	useBusLane: z.boolean(),
	untilMaxMarkingHour: z.boolean(),
	freeParking: z.boolean(),
	withEMark: z.boolean(),
	parkingDisk: z.boolean(),
	nonePrivileges: z.boolean(),
	whileCharging: z.boolean(),
	websiteExtras: z.array(websiteSchema).max(20),
});

const ticketIdSchema = z.string().min(1).max(64);

export const getAdminSessionFn = createServerFn({ method: "GET" }).handler(() =>
	getAdminSession(),
);

export const loginAdminFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			email: z.string().email(),
			password: z.string().min(1).max(200),
		}),
	)
	.handler(({ data }) => loginAdmin(data.email, data.password));

export const logoutAdminFn = createServerFn({ method: "POST" }).handler(() =>
	logoutAdmin(),
);

export const listTicketsFn = createServerFn({ method: "GET" })
	.validator(
		z.object({
			page: z.number().int().min(1).optional(),
			perPage: z.number().int().min(1).max(50).optional(),
			query: z.string().max(100).optional(),
			status: z.enum(["pending", "resolved", "all"]).optional(),
		}),
	)
	.handler(({ data }) => listTickets(data));

export const getTicketFn = createServerFn({ method: "GET" })
	.validator(z.object({ ticketId: ticketIdSchema }))
	.handler(({ data }) => getTicket(data.ticketId));

export const approveNewTicketFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			ticketId: ticketIdSchema,
			expectedUpdated: z.string().min(1),
			values: ticketValuesSchema,
			note: z.string().max(2000).optional(),
		}),
	)
	.handler(({ data }) => approveNewTicket(data));

export const rejectTicketFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			ticketId: ticketIdSchema,
			expectedUpdated: z.string().min(1),
			note: z.string().max(2000).optional(),
		}),
	)
	.handler(({ data }) => rejectTicket(data));

export const mergeCorrectionFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			ticketId: ticketIdSchema,
			expectedTicketUpdated: z.string().min(1),
			expectedCityUpdated: z.string().min(1),
			values: ticketValuesSchema,
			note: z.string().max(2000).optional(),
		}),
	)
	.handler(({ data }) => mergeCorrection(data));

export const reopenTicketFn = createServerFn({ method: "POST" })
	.validator(
		z.object({
			ticketId: ticketIdSchema,
			expectedUpdated: z.string().min(1),
		}),
	)
	.handler(({ data }) => reopenTicket(data));

export const deleteTicketFn = createServerFn({ method: "POST" })
	.validator(z.object({ ticketId: ticketIdSchema }))
	.handler(({ data }) => deleteTicket(data));
