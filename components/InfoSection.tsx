import { JSX } from "react";
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

function hasAllPrivileges(item: InboxCity): boolean {
	return (
		item.freeParking &&
		(item.parkingHours > 0 || item.untilMaxMarkingHour) &&
		item.useBusLane
	);
}

function whileChargingSuffix(item: InboxCity): null | string {
	if (!item.whileCharging) {
		return null;
	}

	if (!item.untilMaxMarkingHour && item.parkingHours === 0) {
		return null;
	}

	if (item.freeParking || item.untilMaxMarkingHour) {
		return " während des Ladevorgangs";
	}

	return null;
}

export default function InfoSection({
	item,
	className = "",
}: Properties): JSX.Element {
	const chargingIsSuffix = whileChargingSuffix(item);
	const hasSpecificPrivileges = showSpecificPrivileges(item);
	const noMorePrivileges = !hasAllPrivileges(item) && !item.nonePrivileges;

	return (
		<div className={className}>
			{hasSpecificPrivileges && (
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
			{noMorePrivileges && (
				<div className="flex gap-1">
					<span className="mr-1">❌</span>
					<div>Keine weiteren Privilegien für Elektrofahrzeuge</div>
				</div>
			)}
			{!noMorePrivileges && item.nonePrivileges && (
				<div className="flex gap-1">
					<span className="mr-1">❌</span>
					<div>Keine Privilegien für Elektrofahrzeuge</div>
				</div>
			)}
		</div>
	);
}
