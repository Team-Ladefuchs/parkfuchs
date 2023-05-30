import { InboxCity } from "../db/types";

export interface Properties {
	item: InboxCity;
	className?: string;
}

function checkField(): JSX.Element {
	return <span className="mr-1">✅</span>;
}

function showSpecificPrivileges(item: InboxCity): boolean {
	return (
		item.freeParking ||
		item.parkingDisk ||
		item.useBusLane ||
		item.whileCharging
	);
}

function nonePrivilegesPrefix(item: InboxCity): string {
	return showSpecificPrivileges(item) ? "weiteren" : "";
}

function whileChargingSuffix(item: InboxCity): null | string {
	if (!item.whileCharging || item.nonePrivileges) {
		return null;
	}

	if (
		item.whileCharging &&
		!item.untilMaxMarkingHour &&
		item.parkingHours === 0
	) {
		return null;
	}

	if (item.freeParking && item.untilMaxMarkingHour && item.parkingHours) {
		return null;
	}

	return " während des Ladevorgangs";
}

export default function InfoSection({
	item,
	className = "",
}: Properties): JSX.Element {
	const chargingIsSuffix = whileChargingSuffix(item);

	return (
		<div className={className}>
			{showSpecificPrivileges(item) && (
				<section>
					<div>Du darfst kostenlos parken</div>
					<ul>
						{item.parkingHours > 0 && (
							<li className="flex gap-1">
								<p>{checkField()}</p>
								<p>
									bis zu{" "}
									<span className="bold">
										{item.parkingHours}{" "}
										{item.parkingHours > 1
											? "Stunden"
											: "Stunde"}
									</span>
									{chargingIsSuffix}
								</p>
							</li>
						)}

						{item.untilMaxMarkingHour && (
							<li className="flex gap-1">
								<p>{checkField()}</p>
								<p>
									bis zur angegebenen Höchstparkdauer
									{chargingIsSuffix}
								</p>
							</li>
						)}

						{item.whileCharging && !chargingIsSuffix && (
							<li className="flex gap-1">
								<p>{checkField()}</p>
								<p>nur während des Ladevorgangs</p>
							</li>
						)}
						{item.useBusLane && (
							<li className="flex gap-1">
								<p>{checkField()}</p>
								<p>Du darfst die Busspuren befahren</p>
							</li>
						)}
					</ul>
				</section>
			)}
			{(item.withEMark || item.parkingDisk) && (
				<section>
					<div>Du brauchst dafür</div>
					<ul>
						{item.withEMark && (
							<li className="flex gap-1">
								<p>{checkField()}</p>
								<p>ein E-Kennzeichen</p>
							</li>
						)}
						{item.parkingDisk && (
							<li className="flex gap-1">
								<p>{checkField()}</p>
								<p>eine Parkscheibe</p>
							</li>
						)}
					</ul>
				</section>
			)}
			{item.nonePrivileges && (
				<p className="flex gap-1">
					<span className="mr-1">❌</span>
					<div>
						Keine {nonePrivilegesPrefix(item)} Privilegien für
						Elektrofahrzeuge
					</div>
				</p>
			)}
		</div>
	);
}
