import { PlusIcon } from "lucide-react";
import { type TicketValues } from "@/db/admin.types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdminValuesFormProps {
	values: TicketValues;
	onChange: (values: TicketValues) => void;
	disabled?: boolean;
}

const booleanFields: Array<{ key: keyof TicketValues; label: string }> = [
	{ key: "nonePrivileges", label: "Keine Vergünstigungen" },
	{ key: "freeParking", label: "Kostenloses Parken" },
	{ key: "whileCharging", label: "Während des Ladens" },
	{ key: "useBusLane", label: "Busspur nutzen" },
	{ key: "untilMaxMarkingHour", label: "Bis zum Ende der Markierungsstunde" },
	{ key: "parkingDisk", label: "Parkscheibe erforderlich" },
	{ key: "withEMark", label: "Mit E-Kennzeichen" },
];

export default function AdminValuesForm({
	values,
	onChange,
	disabled = false,
}: AdminValuesFormProps) {
	function update<T extends keyof TicketValues>(
		key: T,
		value: TicketValues[T],
	) {
		onChange({ ...values, [key]: value });
	}

	function updateWebsiteExtra(
		index: number,
		key: "label" | "url",
		value: string,
	) {
		const websiteExtras = values.websiteExtras.map(
			(website, websiteIndex) =>
				websiteIndex === index ? { ...website, [key]: value } : website,
		);
		update("websiteExtras", websiteExtras);
	}

	return (
		<fieldset className="min-w-0" disabled={disabled}>
			<FieldGroup>
			<Field>
				<FieldLabel htmlFor="admin-information">Information</FieldLabel>
				<Textarea
					id="admin-information"
					value={values.information}
					onChange={(event) =>
						update("information", event.target.value)
					}
					rows={7}
				/>
			</Field>

			<FieldGroup className="grid gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor="admin-website">Hauptquelle</FieldLabel>
					<Input
						id="admin-website"
						value={values.website ?? ""}
						onChange={(event) =>
							update("website", event.target.value || null)
						}
						placeholder="https://..."
						type="url"
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="admin-parking-hours">
						Parkdauer in Stunden
					</FieldLabel>
					<Input
						id="admin-parking-hours"
						value={values.parkingHours}
						onChange={(event) =>
							update("parkingHours", Number(event.target.value))
						}
						min={0}
						max={24}
						type="number"
					/>
				</Field>
			</FieldGroup>

			<FieldSet>
				<FieldLegend variant="label">Regeln</FieldLegend>
				<FieldGroup className="grid gap-2 sm:grid-cols-2">
					{booleanFields.map(({ key, label }) => (
						<Field key={key} orientation="horizontal">
							<Checkbox
								id={`admin-${key}`}
								checked={Boolean(values[key])}
								onCheckedChange={(checked) =>
									update(key, checked === true)
								}
							/>
							<FieldLabel htmlFor={`admin-${key}`}>
								{label}
							</FieldLabel>
						</Field>
					))}
				</FieldGroup>
			</FieldSet>

			<FieldSet>
				<div className="flex items-center justify-between gap-3">
					<FieldLegend variant="label">Weitere Quellen</FieldLegend>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						className="bottom-0.5 relative"
						onClick={() =>
							update("websiteExtras", [
								...values.websiteExtras,
								{ label: "", url: "" },
							])
						}
					>
						<PlusIcon data-icon="inline-start" />
						Quelle hinzufügen
					</Button>
				</div>
				{values.websiteExtras.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Keine weiteren Quellen vorhanden.
					</p>
				) : null}
				<FieldGroup className="gap-3">
					{values.websiteExtras.map((website, index) => (
						<Field
							key={`${index}-${website.url}`}
							orientation="responsive"
						>
							<FieldLabel
								htmlFor={`admin-website-label-${index}`}
								className="sr-only"
							>
								Bezeichnung
							</FieldLabel>
							<Input
								id={`admin-website-label-${index}`}
								value={website.label ?? ""}
								onChange={(event) =>
									updateWebsiteExtra(
										index,
										"label",
										event.target.value,
									)
								}
								placeholder="Bezeichnung"
								className="@md/field-group:min-w-0 @md/field-group:flex-[0.7]"
							/>
							<FieldLabel
								htmlFor={`admin-website-url-${index}`}
								className="sr-only"
							>
								URL
							</FieldLabel>
							<Input
								id={`admin-website-url-${index}`}
								value={website.url ?? ""}
								onChange={(event) =>
									updateWebsiteExtra(
										index,
										"url",
										event.target.value,
									)
								}
								placeholder="https://..."
								type="url"
								className="@md/field-group:min-w-0 @md/field-group:flex-1"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={() =>
									update(
										"websiteExtras",
										values.websiteExtras.filter(
											(_, websiteIndex) =>
												websiteIndex !== index,
										),
									)
								}
								aria-label="Quelle entfernen"
							>
								×
							</Button>
						</Field>
					))}
				</FieldGroup>
			</FieldSet>
			</FieldGroup>
		</fieldset>
	);
}
