import { CityRepo, InboxCity } from "../db/types";
import InfoSection from "./InfoSection";
import Url from "./Link";
import Linkify from "linkify-react";
import Link from "next/link";
import { formatLink } from "../functions/utils";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import germanStrings from "react-timeago/lib/language-strings/de";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(germanStrings);

import TimeAgo from "react-timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface Properties {
	items: InboxCity[];
	isEmpty: boolean;
	className?: string;
	onOpenDialog: () => void;
}

function renderLink({ attributes, content }): JSX.Element {
	const { href } = attributes;

	return (
		<Link href={href} className="underline" target="_blank">
			{formatLink(content)}
		</Link>
	);
}

async function shareCity({ postcodes, name }: CityRepo) {
	if (!navigator.share) {
		return;
	}
	try {
		await navigator.share({
			title: "Parkfuchs",
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
	const [shareIsSupported] = useState("share" in navigator);
	const [selectedID, setSelectedID] = useState("");
	const { setEditCity } = useContext(AppContext);

	const isSelected = (id: string) => {
		return selectedID === id;
	};

	useEffect(() => {
		if (items.length === 1) {
			setSelectedID(items[0]!.id);
		}
	}, [items]);

	return (
		<div className={`accordion ${className}`} id="accordionList">
			{isEmpty && (
				<div className="text-center px-4 text-lg my-6">
					Es wurde keine Stadt gefunden. Vielleicht möchtest du eine
					neue anlegen?
				</div>
			)}

			{items.map((item) => {
				return (
					<div
						key={item.id}
						className="accordion-item-wrapper bg-cardBg border border-gray-200 w-full"
					>
						<h2 className="accordion-header mb-0">
							<header
								className={`accordion-button 
						relative block items-center w-full py-4 px-5
						text-base text-black text-left
						bg-white border-0 rounded-none
						transition focus:outline-none ${
							isSelected(item.id) ? "accordion-button-open" : ""
						}`}
								role="button"
								aria-label="Ort ausklappen Button"
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
												className="p-2"
												onClick={async (event) => {
													event.stopPropagation();
													await shareCity(
														item.cityRef
													);
												}}
											>
												<FontAwesomeIcon
													icon={
														faArrowUpRightFromSquare
													}
													size="lg"
												/>
											</button>
										)}
								</div>
							</header>
						</h2>
						<div
							className={`accordion-content ${
								isSelected(item.id)
									? "accordion-content-open"
									: ""
							}`}
							aria-labelledby={item.id}
						>
							<div className="accordion-body">
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
												{item.information}
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
									<section className="text-neutral-500 text-sm mt-1">
										<div>
											<p>{"—"}</p>
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
											className="min-w-max underline flex relative bottom-1"
											onClick={(_e) => {
												setEditCity(item);
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
