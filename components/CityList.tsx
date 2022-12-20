import { InboxCity } from "../db/types";
import ReactList from "react-list";
import InfoSection from "./InfoSection";
import Url from "./Link";
import Linkify from "linkify-react";
import Link from "next/link";
import { formatLink } from "../functions/utils";

export interface Properties {
	items: InboxCity[];
	isEmpty: boolean;
	className?: string;
}

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
}: Properties): JSX.Element {
	const renderItem = (index: number, _key: any) => {
		const item: InboxCity = items[index]!;
		return (
			<div
				key={item.id}
				className="accordion-item bg-cardBg border border-gray-200 w-full"
			>
				<h2 className="accordion-header mb-0" id={item.id}>
					<button
						className="accordion-button collapsed
						relative block items-center w-full py-4 px-5
						text-base text-black text-left
						bg-white border-0 rounded-none
						transition focus:outline-none"
						type="button"
						data-bs-toggle="collapse"
						aria-label="Ort aus­klap­pen Button"
						data-bs-target={`#x${item.id}`}
						aria-expanded="true"
					>
						<p className="text-black card-title">
							{item.expand.cityID.name}
						</p>
						<p className="text-neutral-500">
							{item.expand.cityID.state}
						</p>
					</button>
				</h2>
				<div
					id={`x${item.id}`}
					className="accordion-collapse collapse"
					aria-labelledby={item.id}
					aria-label="Ort Information"
					data-bs-parent="#accordionList"
				>
					<div className="accordion-body py-7 px-12 grid gap-4 max-md:px-5 max-md:py-4">
						<InfoSection item={item} className="grid gap-4" />

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
								!item.website && !item.websiteExtras?.length
							}
						>
							{item.website && <Url link={item.website} />}
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
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className={`accordion ${className}`} id="accordionList">
			{isEmpty && (
				<div className="text-center px-4 text-lg mt-12">
					Es wurde keine Stadt gefunden. Vielleicht möchtest du eine
					neue anlegen?
				</div>
			)}
			{items.length > 0 && (
				<ReactList
					itemRenderer={renderItem}
					length={items.length}
					pageSize={items.length}
					// type="uniform"
				/>
			)}
		</div>
	);
}
