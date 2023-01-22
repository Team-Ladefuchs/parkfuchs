import axios from "axios";

import { useState } from "react";
import { NewCity, ResultCity, Website } from "../db/types";
import AutoCompleteInput from "./AutoCompleteInput";
import Image from "next/image";
import parkfuchsLogo from "../public/parkfuchs.svg";
import toast from "react-hot-toast";

import { webKeyPattern } from "./WebsiteAddField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Form from "./Form";

interface Properties {
	isOpen: boolean;
	initQuery: string;
	onClose: () => void;
}

export default function Dialog({
	isOpen,
	onClose,
	initQuery = "",
}: Properties): JSX.Element {
	const [selectedCity, setSelectedCity] = useState<ResultCity | null>(null);

	const [isResetForm, setIsResetForm] = useState(false);

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
			city: selectedCity.name,
			website: formData.website,
			cityID: selectedCity.id,
			websiteExtras: websiteExtras,
			information: formData.information.trim(),
			useBusLane: formData.useBusLane,
			untilMaxMarkingHour: formData.untilMaxMarkingHour,
			freeParking: formData.freeParking,
			withEMark: formData.withEMark,
			parkingDisk: formData.parkingDisk,
			nonePrivileges: formData.nonePrivileges,
			whileCharging: formData.whileCharging,
		};
		console.log("saving new City", { newCity });
		handleOnClose();
		await toast.promise(
			axios.post("/api/newCity", newCity),
			{
				loading: "Wird gespeichert …",
				success: `Danke, ${selectedCity.name} wird geprüft und bald freigegeben.`,
				error: "Ouch! Es ist ein Fehler aufgetreten. Techniker ist informiert.",
			},
			{ duration: 3200 }
		);
	};

	const resetFields = () => {
		setSelectedCity(null);
		setIsResetForm(true);
	};

	const handleSelectedCity = (city: ResultCity): void => {
		setSelectedCity(city);
	};

	const handleOnClose = () => {
		resetFields();
		onClose();
	};

	if (!isOpen) {
		return <></>;
	}
	return (
		<div
			id="defaultModal"
			role="dialog"
			className="fixed top-0 left-0 right-0 z-50 w-full p-4 animate-fade overflow-x-hidden bg-gray-600 bg-opacity-75 pt-10 overflow-y-auto inset-0 h-modal h-full "
		>
			<div
				role="form"
				aria-label="Formular zum hinzufügen eines neuen Ortes"
				className="w-full h-full max-w-2xl mx-auto rounded-lg relative animate-slideIn"
			>
				<div className="relative bg-white rounded-lg shadow">
					<div className="flex bg-green rounded-t-lg items-start justify-between p-4 pl-6 border-b max-md:p-5 align-center h-16">
						<Image
							src={parkfuchsLogo}
							width={88}
							role="img"
							alt={"logo"}
							aria-label="Parkfuchs Logo"
							className="relative left-[-10px] top-[-28px]"
						/>
						<h3 className="text-xl font-semibold text-gray-900 items-center">
							Ort hinzufügen
						</h3>
						<button
							type="button"
							role="button"
							onClick={handleOnClose}
							aria-label="dialog schließen"
							className="text-gray-600 bg-transparent hover:bg-darkGreen hover:text-gray-900 rounded-lg text-md p-1.5 ml-auto inline-flex items-center relative"
							data-modal-toggle="defaultModal"
						>
							<FontAwesomeIcon
								icon={faXmark}
								className="w-5 h-5"
							/>
						</button>
					</div>
					<div className="p-6 max-md:px-3 max-h-[76vh] overflow-y-auto space-y-6">
						<AutoCompleteInput
							initQuery={initQuery}
							onSelectedCity={handleSelectedCity}
						/>

						<Form
							selectedCity={selectedCity}
							doReset={isResetForm}
							onSubmit={onSubmit}
							onClose={handleOnClose}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
