import { InboxCity } from "../db/types";
import InfoSection from "./InfoSection";
import Url from "./Link";
import Linkify from "linkify-react";
import Link from "next/link";
import { formatLink } from "../functions/utils";
import { useContext, useState } from "react";
import { AppContext } from "../context/appContext";

export interface Properties {
	items: InboxCity[];
	isEmpty: boolean;
	className?: string;
	onOpenDialog: () => void;
}

const formateDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString("de-DE", {
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
	});
};

function renderLink({ attributes, content }): JSX.Element {
	const { href } = attributes;

	return (
		<Link href={href} className="underline" target="_blank">
			{formatLink(content)}
		</Link>
	);
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
	const [selectedID, setSelectedID] = useState("");
	const { setEditCity } = useContext(AppContext);
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
							<button
								className={`accordion-button 
						relative block items-center w-full py-4 px-5
						text-base text-black text-left
						bg-white border-0 rounded-none
						transition focus:outline-none ${
							selectedID === item.id
								? "accordion-button-open"
								: ""
						}`}
								type="button"
								aria-label="Ort ausklappen Button"
								onClick={() => {
									if (selectedID === item.id) {
										setSelectedID("");
									} else {
										setSelectedID(item.id);
									}
								}}
							>
								<p className="text-black card-title">
									{item.cityRef.name}
								</p>
								<p className="text-neutral-500">
									{item.cityRef.state}
								</p>
							</button>
						</h2>
						<div
							className={`accordion-content ${
								selectedID === item.id
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
									<div>
										Zuletzt Aktualisiert am{" "}
										{formateDate(item.updated)}
									</div>
									<button
										className="min-w-max underline text-neutral-600 justify-self-end flex text-sm"
										onClick={(_e) => {
											setEditCity(item);
											openDialog();
										}}
									>
										Falsche Info melden
									</button>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
