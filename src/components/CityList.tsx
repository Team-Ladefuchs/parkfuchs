import Linkify from "linkify-react";
import { type JSX, useContext, useEffect, useState } from "react";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import germanStrings from "react-timeago/lib/language-strings/de";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import TimeAgo from "react-timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppContext } from "@/context/appContext";
import { formatLink } from "@/functions/utils";
import { getCityById } from "@/db/city.functions";
import Url from "@/components/Link";
import InfoSection from "@/components/InfoSection";

import { type CityRepo, type InboxCity } from "@/db/types";

const formatter = buildFormatter(germanStrings);

export interface Properties {
	items: Array<InboxCity>;
	isEmpty: boolean;
	className?: string;
	onOpenDialog: () => void;
}

function renderLink({ attributes, content }): JSX.Element {
	const { href } = attributes;

	return (
		<a href={href} className="underline" target="_blank" rel="noreferrer">
			{formatLink(content)}
		</a>
	);
}

async function shareCity({ postcodes, name }: CityRepo, hasExtras: boolean) {
	if (!navigator.share) {
		return;
	}
	try {
		await navigator.share({
			title: "Parkfuchs",
			text: hasExtras
				? "Guck mal, hier gibt es ein paar Vorteile für Elektro-Autos!"
				: undefined,
			url: encodeURI(
				`${location.origin}?query=${postcodes[0] ?? ""}, ${name}`
			),
		});
	} catch (error) {
		console.error("[shareCity]", error);
	}
}

const options = {
	render: renderLink,
	className:
		"font-sans w-fill max-w-xl max-sm:w-[290px] break-words whitespace-pre-wrap",
};

export default function CityList({
	items,
	className = "",
	isEmpty = false,
	onOpenDialog: openDialog,
}: Properties): JSX.Element {
	const [shareIsSupported, setShareIsSupported] = useState(false);
	const [selectedID, setSelectedID] = useState("");
	const { setEditCity } = useContext(AppContext);

	const isSelected = (id: string) => {
		return selectedID === id;
	};

	useEffect(() => {
		if (navigator && "share" in navigator) {
			setShareIsSupported(true);
		}
	});

	useEffect(() => {
		if (items.length > 1) {
			setSelectedID("");
			return;
		}
		if (!items[0]?.id) {
			return;
		}
		const { id } = items[0];

		if (id == selectedID) {
			return;
		}
		setSelectedID(id);
	}, [items]);

	return (
		<div
			className={`accordion ${className} divide-y-2 divide-gray-200`}
			id="accordionList"
		>
			{isEmpty && (
				<div className="text-center px-4 text-lg my-6">
					Es wurde keine Stadt gefunden. Vielleicht möchtest du eine
					neue anlegen?
				</div>
			)}

			{items.map((item, index) => {
				return (
					<div
						key={item.id}
						className="accordion-item-wrapper w-full"
					>
						<header className="accordion-header mb-0 cursor-pointer">
							<button
								className={`accordion-button 
									relative block items-center w-full py-4 px-5
									text-base text-black text-left
									bg-white transition focus:outline-none ${
										isSelected(item.id)
											? "!bg-green-normal"
											: ""
									} ${index === 0 ? "rounded-t-md" : ""} ${
									index === items.length ? "rounded-t-md" : ""
								}`}
								type="button"
								aria-label="Ort ausklappen Button"
								aria-expanded={isSelected(item.id)}
								onClick={() => {
									if (isSelected(item.id)) {
										setSelectedID("");
									} else {
										setSelectedID(item.id);
									}
								}}
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-black card-title">
											{item.cityRef.name}
										</p>
										<p className="text-neutral-500">
											{item.cityRef.state}
										</p>
									</div>
									{shareIsSupported &&
										isSelected(item.id) && (
											<button
												className="p-2 active:outline-none!  webkit-highlight-fix"
												onClick={async (event) => {
													event.stopPropagation();
													await shareCity(
														item.cityRef,
														item.freeParking ||
															item.whileCharging ||
															item.useBusLane
													);
												}}
											>
												<FontAwesomeIcon
													icon={
														faArrowUpRightFromSquare
													}
												/>
											</button>
										)}
								</div>
							</button>
						</header>
						<div
							className={`accordion-content ${
								isSelected(item.id)
									? "accordion-content-open"
									: ""
							}`}
							aria-labelledby={item.id}
						>
							<div className="accordion-body bg-white">
								<div
									className="py-7 px-12 grid gap-4 max-md:px-5 max-md:py-4"
									aria-label="Ort Information"
								>
									<InfoSection
										item={item}
										className="grid gap-4"
									/>

									{item.information && (
										<Linkify as="pre" options={options}>
											<span className="font-sans break-words whitespace-pre-wrap">
												{item.information.replaceAll(
													/\r\n/g,
													"\n"
												)}
											</span>
										</Linkify>
									)}

									<div
										className="max-w-xl"
										hidden={
											!item.website &&
											!item.websiteExtras?.length
										}
									>
										{item.website && (
											<Url link={item.website} />
										)}
										{item.websiteExtras?.length > 0 &&
											item.websiteExtras
												.filter((x) => x.url)
												.map((link) => (
													<Url
														key={link.url}
														link={link.url}
														label={link.label}
													/>
												))}
									</div>
									<section className="text-neutral-500 text-sm mt-5">
										<div>
											<p className="relative bottom-1">
												Zuletzt aktualisiert{" "}
												<TimeAgo
													date={Date.parse(
														item.updated
													)}
													formatter={formatter}
												/>
											</p>
										</div>
										<button
											className="min-w-max underline font-bold flex relative bottom-1"
											onClick={async () => {
												const city = await getCityById(
													{
														data: {
															cityId: item.city,
														},
													}
												);
												if (!city) {
													return;
												}
												setEditCity(city);
												openDialog();
											}}
										>
											Falsche Info melden
										</button>
									</section>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
