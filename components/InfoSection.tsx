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

function whileChargingSuffix(item: InboxCity): null | string {
	if (!item.whileCharging || item.nonePrivileges) {
		return null;
	}
	if (
		!item.freeParking &&
		!item.untilMaxMarkingHour &&
		item.parkingHours === 0
	) {
		return null;
	}

	return " oder während des Ladevorgangs";
}

export default function InfoSection({
	item,
	className = "",
}: Properties): JSX.Element {
	const chargingIsSuffix = whileChargingSuffix(item);

	return (
		<div className={className}>
			{item.nonePrivileges && (
				<p>
					<span className="mr-1">❌</span> Keine Privilegien für
					Elektroautos
				</p>
			)}
			{!item.nonePrivileges && (
				<>
					{showSpecificPrivileges(item) && (
						<section>
							<div>Du darfst kostenlos parken</div>
							<ul>
								<li>
									{item.parkingHours > 0 && (
										<>
											{checkField()} bis zu{" "}
											<span className="bold">
												{item.parkingHours} Stunden
											</span>
											{chargingIsSuffix}
										</>
									)}
									{!item.parkingHours &&
										item.untilMaxMarkingHour && (
											<>
												{checkField()} bis zur
												angegebenen Höchstparkdauer
												{chargingIsSuffix}
											</>
										)}
								</li>
								{item.whileCharging && !chargingIsSuffix && (
									<li>
										{checkField()}
										während des Ladevorgangs
									</li>
								)}
								{item.useBusLane && (
									<li>
										{checkField()} Du darfst die Busspuren
										befahren
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
									<li>{checkField()} ein E-Kennzeichen</li>
								)}
								{item.parkingDisk && (
									<li>{checkField()} eine Parkscheibe</li>
								)}
							</ul>
						</section>
					)}
				</>
			)}
		</div>
	);
}
