"use client";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { NewCity, Website } from "../db/types";
import AutoCompleteInput from "./AutoCompleteInput";
import Image from "next/image";
import parkfuchsLogo from "../public/parkfuchs.svg";
import toast from "react-hot-toast";

import { webKeyPattern } from "./WebsiteAddField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircleExclamation,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Form from "./Form";
import { AppContext } from "../context/appContext";

interface Properties {
	isOpen: boolean;
	initQuery: string;
	onClose: () => void;
}

export interface SlimCity {
	id: string;
	name: string;
	state: string;
	cityRefId: string;
	stateCode: string;
	postcode: string[];
	exists: boolean;
}

export default function Dialog({
	isOpen,
	onClose,
	initQuery = "",
}: Properties): JSX.Element {
	const [selectedCity, setSelectedCity] = useState<SlimCity | null>(null);

	const [isResetForm, setIsResetForm] = useState(false);
	const { setSearchQuery } = useContext(AppContext);

	const { editCity, setEditCity } = useContext(AppContext);

	useEffect(() => {
		setSearchQuery(initQuery);
	}, [initQuery]);

	useEffect(() => {
		if (!editCity) {
			return;
		}
		setSelectedCity({
			id: editCity.id,
			stateCode: editCity.cityRef.stateCode,
			state: editCity.cityRef.state,
			name: editCity.cityRef.state,
			cityRefId: editCity.cityRef.id,
			postcode: editCity.cityRef.postcodes,
			exists: false,
		});
	}, [setEditCity]);

	const onSubmit = async (formData: NewCity) => {
		const websiteExtras: Array<Website> = Object.entries(formData)
			.filter(([_key, value]) => value?.length > 0)
			.filter(([key, _value]) => key.startsWith(webKeyPattern))
			.map(([_key, url]) => ({
				url,
			}));

		if (!selectedCity || !formData) {
			return;
		}

		const newCity: NewCity = {
			parkingHours: parseFloat(formData.parkingHours?.toString() ?? "0"),
			website: formData.website,
			city: selectedCity.cityRefId,
			websiteExtras: websiteExtras,
			information: formData.information.trim(),
			useBusLane: formData.useBusLane,
			untilMaxMarkingHour: formData.untilMaxMarkingHour,
			freeParking: formData.freeParking,
			withEMark: formData.withEMark,
			parkingDisk: formData.parkingDisk,
			nonePrivileges: formData.nonePrivileges,
			whileCharging: formData.whileCharging,
			currentCity: editCity?.id ?? null,
		};
		console.log("saving new City", { newCity });
		handleOnClose();
		await toast.promise(
			axios.post("/api/newCity", newCity),
			{
				loading: "Wird gespeichert …",
				success: editCity
					? `Danke für deine Meldung. ${selectedCity.name} wird geprüft und falls nötig korrigiert`
					: `Vielen Dank, ${selectedCity.name} wird geprüft und bald freigegeben.`,
				error: "Ouch! Es ist ein Fehler aufgetreten. Techniker ist informiert.",
			},
			{ duration: 3200 }
		);
	};

	const resetFields = () => {
		setSelectedCity(null);
		setEditCity(null);
		setIsResetForm(true);
	};

	const handleSelectedCity = (city: SlimCity): void => {
		setSelectedCity(city);
	};

	const handleOnClose = () => {
		resetFields();
		onClose();
	};

	return (
		<dialog
			open={isOpen}
			id="dialog"
			aria-label="Formular zum hinzufügen eines neuen Ortes"
			className="w-full mx-auto animate-slideIn overflow-y-hidden z-50 backdrop:bg-red-300 bg-gray-600 inset-0 h-full fixed bg-opacity-80"
		>
			<div className="bg-white rounded-lg shadow mt-1 opacity-100 max-w-2xl mx-auto">
				<header className="flex bg-green rounded-t-lg items-start justify-between p-4 pl-6 border-b max-md:p-5 align-start h-14">
					<Image
						src={parkfuchsLogo}
						width={68}
						role="img"
						alt={"logo"}
						aria-label="Parkfuchs Logo"
						className="relative left-[-10px] top-[-20px]"
					/>
					<h3 className="text-xl font-semibold text-gray-900 items-center relative bottom-[2px]">
						{editCity ? "Falsche Info melden" : "Ort hinzufügen"}
					</h3>
					<button
						type="button"
						role="button"
						onClick={handleOnClose}
						aria-label="dialog schließen"
						className="text-gray-600 bg-transparent hover:bg-darkGreen hover:text-gray-900 rounded-lg text-md p-1.5 ml-auto inline-flex items-center relative bottom-[4px]"
						data-modal-toggle="defaultModal"
					>
						<FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
					</button>
				</header>
				<div className="p-6 pt-4 max-md:px-3 overflow-y-auto space-y-6 max-h-[85vh]">
					{!editCity && (
						<>
							<AutoCompleteInput
								initQuery={initQuery}
								onSelectedCity={handleSelectedCity}
							/>
							{selectedCity?.exists && (
								<div className="bg-lightGreen p-3 rounded-lg text-black flex gap-4 items-center ">
									<FontAwesomeIcon
										size="2xl"
										icon={faCircleExclamation}
									/>
									<p>
										Du möchtest <b>{selectedCity.name}</b>{" "}
										eingeben?
										<br />
										Hast du gesehen, dass die Stadt bereits
										im Parkfuchs Verzeichnis existiert?
									</p>
								</div>
							)}
						</>
					)}

					<Form
						selectedCity={selectedCity}
						doReset={isResetForm}
						onSubmit={onSubmit}
						onClose={handleOnClose}
					/>
				</div>
			</div>
		</dialog>
	);
}
