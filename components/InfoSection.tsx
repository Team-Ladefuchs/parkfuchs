import { InboxCity } from "../db/types";

export interface Properties {
	item: InboxCity;
	className?: string;
}

export default function InfoSection({
	item,
	className = "",
}: Properties): JSX.Element {
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
					<section>
						<p>
							<span className="mr-1">✅</span> Du darfst{" "}
							{item.parkingHours > 0 && (
								<span className="bold">
									{item.parkingHours} Std.
								</span>
							)}
							{!item.parkingHours && item.untilMaxMarkingHour && (
								<>bis zur angegeb. Höchstparkdauer</>
							)}{" "}
							kostenlos parken
						</p>
						{item.useBusLane && (
							<p>
								<span className="mr-1">✅</span> Du darfst die
								Busspuren befahren
							</p>
						)}
					</section>
					{(item.withEMark || item.parkingDisk) && (
						<section>
							<div>Du brauchst dafür</div>
							<ul>
								{item.withEMark && (
									<li>
										<span className="mr-1">✅</span> ein
										E-Kennzeichen
									</li>
								)}
								{item.parkingDisk && (
									<li>
										<span className="mr-1">✅</span> eine
										Parkscheibe
									</li>
								)}
							</ul>
						</section>
					)}
				</>
			)}
		</div>
	);
}
