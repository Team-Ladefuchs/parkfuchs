import { Link, createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { CheckIcon, ChevronRightIcon, RotateCcwIcon, Trash2Icon, Undo2Icon, XIcon } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminValuesForm from "@/components/admin/AdminValuesForm";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
	approveNewTicketFn,
	deleteTicketFn,
	getAdminSessionFn,
	getTicketFn,
	mergeCorrectionFn,
	rejectTicketFn,
	reopenTicketFn,
} from "@/db/admin.functions";
import { type ModerationStatus, type TicketValues } from "@/db/admin.types";

type ResolveAction = "approve" | "merge" | "reject";
type FieldDecision = "accepted" | "kept";

const statusLabels: Record<ModerationStatus, string> = {
	pending: "Offen",
	approved: "Freigegeben",
	merged: "Übernommen",
	rejected: "Abgelehnt",
};

export const Route = createFileRoute("/admin/tickets/$ticketId")({
	head: () => ({ meta: [{ title: "Parkfuchs Admin" }] }),
	loader: async ({ params }) => {
		const session = await getAdminSessionFn();
		if (!session.authenticated) {
			throw redirect({ to: "/admin/login" });
		}

		const ticket = await getTicketFn({ data: { ticketId: params.ticketId } });
		return { session, ticket };
	},
	component: TicketReview,
});

function TicketReview() {
	const { session, ticket } = Route.useLoaderData();
	const navigate = useNavigate();
	const router = useRouter();
	const currentValues = ticket.currentCity?.values;
	const isResolved = ticket.status !== "pending";
	const cityName = ticket.city?.name ?? ticket.currentCity?.city?.name;
	const [values, setValues] = useState<TicketValues>(() => cloneValues(currentValues ?? ticket.values));
	const [decisions, setDecisions] = useState<Partial<Record<keyof TicketValues, FieldDecision>>>({});
	const [note, setNote] = useState(ticket.reviewNote ?? "");
	const [busy, setBusy] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function resolve(action: ResolveAction) {
		setBusy(true);
		setError(null);

		try {
			if (action === "approve") {
				await approveNewTicketFn({
					data: {
						ticketId: ticket.id,
						expectedUpdated: ticket.updated,
						values,
						note,
					},
				});
				toast.add({ title: "Stadt freigegeben", description: cityName, type: "success" });
			} else if (action === "merge" && currentValues && ticket.currentCity) {
				await mergeCorrectionFn({
					data: {
						ticketId: ticket.id,
						expectedTicketUpdated: ticket.updated,
						expectedCityUpdated: ticket.currentCity.updated,
						values,
						note,
					},
				});
				toast.add({ title: "Änderung übernommen", description: cityName, type: "success" });
			} else if (action === "reject") {
				await rejectTicketFn({
					data: { ticketId: ticket.id, expectedUpdated: ticket.updated, note },
				});
				toast.add({ title: "Ticket abgelehnt", description: cityName, type: "success" });
			}

			navigate({ to: "/admin", search: { query: "", status: "pending", page: 1 } });
		} catch (cause) {
			setError(getErrorMessage(cause));
			setBusy(false);
		}
	}

	async function reopen() {
		setBusy(true);
		setError(null);

		try {
			await reopenTicketFn({
				data: { ticketId: ticket.id, expectedUpdated: ticket.updated },
			});
			toast.add({ title: "Ticket wieder geöffnet", description: cityName, type: "success" });
			await router.invalidate();
		} catch (cause) {
			setError(getErrorMessage(cause));
		} finally {
			setBusy(false);
		}
	}

	async function remove() {
		setBusy(true);
		setError(null);

		try {
			await deleteTicketFn({ data: { ticketId: ticket.id } });
			toast.add({ title: "Ticket gelöscht", description: cityName, type: "success" });
			navigate({ to: "/admin", search: { query: "", status: "pending", page: 1 } });
		} catch (cause) {
			setError(getErrorMessage(cause));
			setBusy(false);
			setDeleteOpen(false);
		}
	}

	const changedFields = currentValues ? getChangedFields(currentValues, ticket.values) : [];
	const reviewedFields = changedFields.filter((field) => decisions[field]).length;
	const actionLabel = ticket.type === "new" ? "Stadt freigeben" : "Änderung übernehmen";

	function decideField(field: keyof TicketValues, decision: FieldDecision) {
		if (!currentValues) return;

		setDecisions((previous) => ({ ...previous, [field]: decision }));
		setValues((previous) => ({
			...previous,
			[field]: decision === "accepted" ? ticket.values[field] : currentValues[field],
		}));
	}

	return (
		<AdminShell displayName={session.displayName}>
			<div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_388px] lg:items-start">
				<div className="flex items-center justify-between gap-4 lg:col-span-2">
					<Link to="/admin" search={{ query: "", status: "pending", page: 1 }} className="text-sm font-bold text-destructive hover:underline">
						← Zurück zum Eingang
					</Link>
				</div>

				<Card className="bg-primary text-primary-foreground [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(7)] lg:col-start-1">
					<CardHeader>
						<span className="flex flex-wrap items-center gap-3">
							<span className="inline-flex items-center rounded-full bg-primary-foreground px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground ring-1 ring-black/10">
								{ticket.type === "new" ? "Neue Stadt" : "Korrektur"}
							</span>
							<span className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary-foreground ring-1 ring-primary-foreground/25">
								{statusLabels[ticket.status]}
							</span>
						</span>
						<CardTitle className="text-3xl font-black tracking-tight">{ticket.city?.name ?? "Unbekannte Stadt"}</CardTitle>
						<CardDescription className="text-primary-foreground/75">
							{ticket.city?.state ?? ""}{ticket.city?.postcodes?.length ? ` · ${ticket.city.postcodes.join(", ")}` : ""}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-primary-foreground/75">Eingegangen am {formatDate(ticket.created)}</p>
						{ticket.relatedTickets.length > 0 ? (
							<div className="mt-5 border-t border-primary-foreground/20 pt-5">
								<p className="font-bold uppercase tracking-[0.18em] text-primary-foreground/75">Weitere offene Tickets</p>
								<p className="mt-1 text-sm text-primary-foreground/75">Wechsle zwischen den Eingängen für diese Stadt.</p>
								<div className="mt-3 flex flex-col gap-2">
									{ticket.relatedTickets.map((related) => (
										<Link
											key={related.id}
											to="/admin/tickets/$ticketId"
											params={{ ticketId: related.id }}
											className="group flex min-h-14 items-center justify-between gap-4 rounded-lg bg-primary-foreground px-4 py-3 text-foreground ring-1 ring-black/10 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
											aria-label={`${related.type === "new" ? "Neue Stadt" : "Korrektur"} vom ${formatDate(related.created)} öffnen`}
										>
											<span>
												<span className="block font-bold">{related.type === "new" ? "Neue Stadt" : "Korrektur"}</span>
												<span className="block text-sm text-muted-foreground">{formatDate(related.created)}</span>
											</span>
											<span className="flex items-center gap-1 font-bold text-primary">
												Öffnen
												<ChevronRightIcon className="transition-transform group-hover:translate-x-0.5" />
											</span>
										</Link>
									))}
								</div>
							</div>
						) : null}
					</CardContent>
				</Card>

				{error ? <Alert variant="destructive" className="lg:col-start-1"><AlertDescription>{error}</AlertDescription></Alert> : null}

			{isResolved ? (
				<Card className="[--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(7)] lg:col-start-2 lg:row-start-2 lg:self-start">
					<CardHeader>
						<CardDescription className="font-bold uppercase tracking-[0.18em] text-destructive">Erledigt</CardDescription>
						<CardTitle>
							{statusLabels[ticket.status]}
							{ticket.reviewedAt ? ` am ${formatDate(ticket.reviewedAt)}` : ""}
							{ticket.reviewedBy ? ` von ${ticket.reviewedBy}` : ""}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<p className="text-sm text-muted-foreground">
							Dieses Ticket ist abgeschlossen. Öffne es wieder, um die Werte erneut zu prüfen
							{ticket.type === "correction" ? " und mit dem Bestand zu vergleichen" : ""}.
						</p>
						{ticket.reviewNote ? (
							<p className="whitespace-pre-wrap text-sm">
								<span className="font-bold">Interne Notiz: </span>
								{ticket.reviewNote}
							</p>
						) : null}
						<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
							<Button
								type="button"
								variant="secondary"
								size="lg"
								className="w-full px-6 font-bold sm:w-auto sm:min-w-44"
								disabled={busy}
								onClick={() => void reopen()}
							>
								{busy ? <Spinner data-icon="inline-start" /> : <RotateCcwIcon data-icon="inline-start" />}
								Ticket wieder öffnen
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
			<Card className="[--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(7)] lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:self-start">
				<CardHeader>
					<CardDescription className="font-bold uppercase tracking-[0.18em] text-destructive">Entscheidung</CardDescription>
					<CardTitle>Die Notiz bleibt intern und wird nicht öffentlich angezeigt.</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<Field>
							<FieldLabel htmlFor="admin-review-note">Interne Notiz (optional)</FieldLabel>
							<Textarea
								id="admin-review-note"
								value={note}
								onChange={(event) => setNote(event.target.value)}
								rows={3}
								className="min-h-24 [field-sizing:fixed]"
								placeholder="Warum wurde die Entscheidung getroffen?"
							/>
						</Field>
						<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-end">
							<Button
								type="button"
								variant="destructive"
								size="lg"
								className="w-full bg-destructive px-6 font-bold text-white hover:bg-destructive/85 sm:w-auto sm:min-w-36"
							disabled={busy}
							onClick={() => void resolve("reject")}
						>
							{busy ? null : <XIcon data-icon="inline-start" />}
								Ablehnen
							</Button>
							<Button
								type="button"
								size="lg"
								className="w-full px-6 font-bold shadow-sm sm:w-auto sm:min-w-44"
							disabled={busy}
							onClick={() => void resolve(ticket.type === "new" ? "approve" : "merge")}
						>
								{busy ? <Spinner data-icon="inline-start" /> : null}
								{busy ? null : <CheckIcon data-icon="inline-start" />}
								{busy ? "Wird gespeichert ..." : actionLabel}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

				{ticket.type === "correction" && currentValues && ticket.currentCity ? (
					<Card className="[--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(7)] lg:col-start-1">
						<CardHeader className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
							<div>
								<CardDescription className="font-bold uppercase tracking-[0.18em] text-destructive">Änderungen</CardDescription>
								<CardTitle>Vorschlag gegen Bestand</CardTitle>
							</div>
							{isResolved ? null : (
								<CardDescription>
									{reviewedFields} von {changedFields.length} Feldern entschieden
								</CardDescription>
							)}
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							{changedFields.map((field) => (
								<DiffRow
									key={field}
									field={field}
									current={currentValues[field]}
									proposed={ticket.values[field]}
									decision={decisions[field]}
									onDecide={(decision) => decideField(field, decision)}
									readOnly={isResolved}
								/>
							))}
							{changedFields.length === 0 ? <p className="text-sm text-muted-foreground">Keine Unterschiede gefunden.</p> : null}
						</CardContent>
					</Card>
				) : null}

			<Card className="[--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(7)] lg:col-start-1">
				<CardHeader>
					<CardDescription className="font-bold uppercase tracking-[0.18em] text-destructive">Feinschliff</CardDescription>
					<CardTitle>
						{isResolved
							? "Das Ticket ist erledigt. Öffne es wieder, um Werte zu ändern."
							: "Passe die ausgewählten Werte hier noch an."}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<AdminValuesForm values={values} onChange={setValues} disabled={isResolved} />
				</CardContent>
			</Card>

			{isResolved ? (
				<Card className="border-destructive/40 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(7)] lg:col-start-2 lg:row-start-3 lg:self-start">
					<CardHeader>
						<CardDescription className="font-bold uppercase tracking-[0.18em] text-destructive">Löschen</CardDescription>
						<CardTitle>Ticket endgültig entfernen</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
							<AlertDialogTrigger
								render={
									<Button
										type="button"
										variant="destructive"
										size="lg"
										className="w-full shrink-0 bg-destructive px-6 font-bold text-white hover:bg-destructive/85"
										disabled={busy}
									/>
								}
							>
								<Trash2Icon data-icon="inline-start" />
								Ticket löschen
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Ticket endgültig löschen?</AlertDialogTitle>
									<AlertDialogDescription>
										„{cityName ?? "Unbekannte Stadt"}“ wird dauerhaft aus der Datenbank gelöscht. Das kann nicht rückgängig gemacht werden.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Abbrechen</AlertDialogCancel>
									<AlertDialogAction
										className="bg-destructive text-white hover:bg-destructive/85"
										disabled={busy}
										onClick={() => void remove()}
									>
										Endgültig löschen
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
						<p className="text-sm text-muted-foreground">
							Das Ticket wird aus der Datenbank gelöscht. Bei einer freigegebenen Stadt verschwindet sie damit auch von der Webseite.
						</p>
					</CardContent>
				</Card>
			) : null}

			</div>
		</AdminShell>
	);
}

function cloneValues(values: TicketValues): TicketValues {
	return { ...values, websiteExtras: values.websiteExtras.map((website) => ({ ...website })) };
}

function getChangedFields(current: TicketValues, proposed: TicketValues): Array<keyof TicketValues> {
	return (Object.keys(proposed) as Array<keyof TicketValues>).filter(
		(field) => JSON.stringify(current[field]) !== JSON.stringify(proposed[field]),
	);
}

function formatValue(value: unknown) {
	if (Array.isArray(value)) {
		return value.length
			? value.map((item) => (typeof item === "object" && item ? `${"label" in item ? item.label : ""} ${"url" in item ? item.url : ""}`.trim() : String(item))).join(", ")
			: "Keine";
	}
	if (typeof value === "boolean") return value ? "Ja" : "Nein";
	if (value === null || value === "") return "Leer";
	return String(value);
}

function fieldLabel(field: keyof TicketValues) {
	const labels: Record<keyof TicketValues, string> = {
		information: "Information",
		website: "Hauptquelle",
		parkingHours: "Parkdauer",
		useBusLane: "Busspur",
		untilMaxMarkingHour: "Bis Markierungsstunde",
		freeParking: "Kostenloses Parken",
		withEMark: "E-Kennzeichen",
		parkingDisk: "Parkscheibe",
		nonePrivileges: "Keine Vergünstigungen",
		whileCharging: "Während des Ladens",
		websiteExtras: "Weitere Quellen",
	};
	return labels[field];
}

function DiffRow({
	field,
	current,
	proposed,
	decision,
	onDecide,
	readOnly = false,
}: {
	field: keyof TicketValues;
	current: unknown;
	proposed: unknown;
	decision?: FieldDecision;
	onDecide: (decision: FieldDecision) => void;
	readOnly?: boolean;
}) {
	return (
		<Card size="sm">
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<CardTitle className="text-sm">{fieldLabel(field)}</CardTitle>
				<Badge variant={decision ? "secondary" : "outline"}>
					{decision === "accepted" ? "Übernommen" : decision === "kept" ? "Beibehalten" : "Offen"}
				</Badge>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<div className="grid gap-2 sm:grid-cols-2">
					<ValuePanel label="Bestand" value={current} />
					<ValuePanel label="Vorschlag" value={proposed} accent />
				</div>
				{readOnly ? null : (
					<div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant={decision === "kept" ? "secondary" : "outline"}
							onClick={() => onDecide("kept")}
						>
							<Undo2Icon data-icon="inline-start" />
							Bestand behalten
						</Button>
						<Button
							type="button"
							variant={decision === "accepted" ? "default" : "outline"}
							onClick={() => onDecide("accepted")}
						>
							<CheckIcon data-icon="inline-start" />
							Änderung übernehmen
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function ValuePanel({ label, value, accent = false }: { label: string; value: unknown; accent?: boolean }) {
	return (
		<div className={`rounded-lg border p-3 ${accent ? "border-primary/40 bg-primary/5" : "bg-muted/30"}`}>
			<p className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">{label}</p>
			<p className="mt-1 whitespace-pre-wrap break-words text-sm">{formatValue(value)}</p>
		</div>
	);
}

function getErrorMessage(cause: unknown) {
	if (!(cause instanceof Error)) return "Speichern fehlgeschlagen.";
	if (cause.message.includes("CONFLICT")) return "Die Daten wurden inzwischen geändert. Bitte Ticket neu laden.";
	if (cause.message.includes("TICKET_RESOLVED")) return "Dieses Ticket wurde bereits bearbeitet.";
	if (cause.message.includes("TICKET_PENDING")) return "Dieses Ticket ist bereits offen.";
	if (cause.message.includes("UNAUTHORIZED")) return "Deine Sitzung ist abgelaufen. Bitte neu anmelden.";
	return cause.message || "Speichern fehlgeschlagen.";
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
