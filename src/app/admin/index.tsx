import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon, SearchIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getAdminSessionFn, listTicketsFn } from "@/db/admin.functions";
import { type AdminTicket } from "@/db/admin.types";

type AdminStatus = "pending" | "resolved" | "all";

export const Route = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Parkfuchs Admin" }] }),
	validateSearch: (search: Record<string, unknown>): { query: string; status: AdminStatus } => ({
		query: typeof search.query === "string" ? search.query : "",
		status: search.status === "resolved" || search.status === "all" ? search.status : "pending",
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const session = await getAdminSessionFn();
		if (!session.authenticated) {
			throw redirect({ to: "/admin/login" });
		}

		const tickets = await listTicketsFn({
			data: { query: deps.query, status: deps.status, page: 1, perPage: 30 },
		});

		return { session, tickets };
	},
	component: AdminInbox,
});

function AdminInbox() {
	const { session, tickets } = Route.useLoaderData();
	const { query, status } = Route.useSearch();
	const navigate = useNavigate();
	const [search, setSearch] = useState(query);
	const queueLabel = status === "pending" ? "Offene Tickets" : status === "resolved" ? "Erledigte Tickets" : "Alle Tickets";
	const ticketGroups = groupTickets(tickets.items, status === "pending");
	const duplicateGroupKeys = ticketGroups.filter((group) => group.tickets.length > 1).map((group) => group.key);

	function submitSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		navigate({ to: "/admin", search: { query: search.trim(), status } });
	}

	function changeStatus(nextStatus: AdminStatus) {
		navigate({ to: "/admin", search: { query, status: nextStatus } });
	}

	return (
		<AdminShell displayName={session.displayName}>
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<ToggleGroup
						value={[status]}
						onValueChange={(values) => {
							const nextStatus = values[0] as AdminStatus | undefined;
							if (nextStatus) changeStatus(nextStatus);
						}}
						className="bg-muted p-1"
						aria-label="Ticketstatus"
					>
						<ToggleGroupItem className="px-4 aria-pressed:bg-primary aria-pressed:text-primary-foreground" value="pending">Offen</ToggleGroupItem>
						<ToggleGroupItem className="px-4 aria-pressed:bg-primary aria-pressed:text-primary-foreground" value="resolved">Erledigt</ToggleGroupItem>
						<ToggleGroupItem className="px-4 aria-pressed:bg-primary aria-pressed:text-primary-foreground" value="all">Alle</ToggleGroupItem>
					</ToggleGroup>

					<form onSubmit={submitSearch} className="flex w-full max-w-md items-center gap-2 rounded-xl bg-card p-1.5 pl-3">
						<SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Stadt oder Postleitzahl"
							aria-label="Stadt oder Postleitzahl"
							className="h-9 border-0 bg-transparent px-1 shadow-none focus-visible:border-transparent focus-visible:ring-0"
						/>
						<Button type="submit" className="h-9 px-4">Suchen</Button>
					</form>
				</div>

				{tickets.items.length === 0 ? (
					<Empty className="min-h-72 bg-card">
						<EmptyHeader>
							<EmptyTitle>Nichts zu tun.</EmptyTitle>
							<EmptyDescription>Für diesen Filter gibt es keine Tickets.</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<section aria-labelledby="queue-heading">
						<div className="mb-3 flex items-baseline justify-between gap-4 px-1">
							<h2 id="queue-heading" className="text-lg font-black tracking-tight">{queueLabel}</h2>
							<p className="text-sm text-muted-foreground">
								{tickets.totalItems} {tickets.totalItems === 1 ? "Eintrag" : "Einträge"}
							</p>
						</div>
						<Accordion
							key={`${status}:${duplicateGroupKeys.join(",")}`}
							multiple
							defaultValue={duplicateGroupKeys}
							className="divide-y divide-border/70 overflow-hidden rounded-xl bg-card"
						>
							{ticketGroups.map((group) => group.tickets.length > 1 ? (
								<DuplicateTicketGroup key={group.key} group={group} />
							) : (
								<TicketLink key={group.key} ticket={group.tickets[0]!} />
							))}
						</Accordion>
					</section>
				)}
			</div>
		</AdminShell>
	);
}

interface TicketGroup {
	key: string;
	tickets: Array<AdminTicket>;
}

function groupTickets(tickets: Array<AdminTicket>, groupByCity: boolean): Array<TicketGroup> {
	const groups = new Map<string, Array<AdminTicket>>();

	for (const ticket of tickets) {
		const key = groupByCity && ticket.city?.id ? `city:${ticket.city.id}` : `ticket:${ticket.id}`;
		const group = groups.get(key);
		if (group) {
			group.push(ticket);
		} else {
			groups.set(key, [ticket]);
		}
	}

	return Array.from(groups, ([key, groupedTickets]) => ({ key, tickets: groupedTickets }));
}

function DuplicateTicketGroup({ group }: { group: TicketGroup }) {
	const city = group.tickets[0]!.city;

	return (
		<AccordionItem value={group.key}>
			<AccordionTrigger className="min-h-24 gap-4 px-4 py-4 hover:bg-muted/60 sm:px-5">
				<span className="min-w-0 flex-1">
					<span className="block truncate text-lg font-black tracking-tight">{city?.name ?? "Unbekannte Stadt"}</span>
					<span className="mt-1 block truncate text-sm text-muted-foreground">
						{formatLocation(city?.state, city?.postcodes)}
					</span>
				</span>
				<Badge className="border-0">{group.tickets.length} offene Tickets</Badge>
			</AccordionTrigger>
			<AccordionContent className="divide-y divide-border/70 border-t border-border/70 bg-muted/25">
				{group.tickets.map((ticket) => (
					<Link
						key={ticket.id}
						to="/admin/tickets/$ticketId"
						params={{ ticketId: ticket.id }}
						className="group flex min-h-16 items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none sm:px-8"
					>
						<span className="flex min-w-0 flex-wrap items-center gap-2">
							<TicketTypeBadge ticket={ticket} />
							<time dateTime={ticket.created} className="text-sm text-muted-foreground">{formatDate(ticket.created)}</time>
						</span>
						<span className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
							<span className="hidden sm:inline">Öffnen</span>
							<ChevronRightIcon className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
						</span>
					</Link>
				))}
			</AccordionContent>
		</AccordionItem>
	);
}

function TicketLink({ ticket }: { ticket: AdminTicket }) {
	return (
		<Link
			to="/admin/tickets/$ticketId"
			params={{ ticketId: ticket.id }}
			className="group grid min-h-24 grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-5"
		>
			<div className="min-w-0">
				<h3 className="truncate text-lg font-black tracking-tight group-hover:text-primary">
					{ticket.city?.name ?? "Unbekannte Stadt"}
				</h3>
				<p className="mt-1 truncate text-sm text-muted-foreground">
					{formatLocation(ticket.city?.state, ticket.city?.postcodes)}
				</p>
			</div>
			<div className="col-start-1 row-start-2 flex flex-wrap items-center gap-2 sm:col-start-2 sm:row-start-1 sm:flex-col sm:items-end">
				<TicketTypeBadge ticket={ticket} />
				<time dateTime={ticket.created} className="text-xs text-muted-foreground">{formatDate(ticket.created)}</time>
			</div>
			<ChevronRightIcon className="col-start-2 row-span-2 row-start-1 size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:col-start-3 sm:row-span-1" aria-hidden="true" />
		</Link>
	);
}

function TicketTypeBadge({ ticket }: { ticket: AdminTicket }) {
	return (
		<Badge variant={ticket.type === "new" ? "secondary" : "default"} className="border-0">
			{ticket.type === "new" ? "Neue Stadt" : "Korrektur"}
		</Badge>
	);
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatLocation(state: string | undefined, postcodes: Array<string> | undefined) {
	return [state, postcodes?.join(", ")].filter(Boolean).join(" · ") || "Keine Ortsangaben";
}
