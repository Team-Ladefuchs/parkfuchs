import { type JSX, useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircleCheck,
	faCircleExclamation,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "@/context/appContext";
import { getCityById, saveCity } from "@/db/city.functions";
import Form from "@/components/Form";
import { webKeyPattern } from "@/components/WebsiteAddField";
import AutoCompleteInput from "@/components/AutoCompleteInput";

import { type NewCity, type Website } from "@/db/types";

interface Properties {
	isOpen: boolean;
	initQuery: string;
	onClose: () => void;
}
// TODO fix me/delete me
export interface SlimCity {
	id: string;
	name: string;
	state: string;
	cityRefId: string;
	stateCode: string;
	postcode: Array<string>;
	exists: boolean;
}

interface Submission {
	cityName: string;
	isCorrection: boolean;
}

export default function Dialog({
	isOpen,
	onClose,
	initQuery = "",
}: Properties): JSX.Element {
	const [selectedCity, setSelectedCity] = useState<SlimCity | null>(null);
	const { editCity, setEditCity } = useContext(AppContext);

	const [isResetForm, setIsResetForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submission, setSubmission] = useState<Submission | null>(null);

	const [search, setSearch] = useState("");

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (initQuery) {
			setSearch(initQuery);
		}
	}, [initQuery, isOpen]);

	useEffect(() => {
		if (!editCity) {
			return;
		}
		setSelectedCity({
			id: editCity.id,
			stateCode: editCity.cityRef.stateCode,
			state: editCity.cityRef.state,
			name: editCity.cityRef.name,
			cityRefId: editCity.cityRef.id,
			postcode: editCity.cityRef.postcodes,
			exists: false,
		});
	}, [editCity]);

	const onSubmit = async (formData: NewCity) => {
		const websiteExtras: Array<Website> = Object.entries(formData)
			.filter(([key]) => key.startsWith(webKeyPattern))
			.filter((entry): entry is [string, string] =>
				typeof entry[1] === "string"
			)
			.map(([_key, url]) => ({ url }));

		if (!selectedCity || !formData) {
			return;
		}
		if (isSubmitting) {
			return;
		}

		const submittedCity = selectedCity;
		const isCorrection = Boolean(editCity);

		const toSave: NewCity = {
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
		console.info("saving new City", { toSave });
		setIsSubmitting(true);
		setSubmitError(null);

		try {
			await saveCity({ data: toSave });
			setSubmission({
				cityName: submittedCity.name,
				isCorrection,
			});
			resetFields();
		} catch (error) {
			console.error("city could not be saved", error);
			setSubmitError(
				"Das hat leider nicht geklappt. Bitte versuche es noch einmal."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetFields = () => {
		setSelectedCity(null);
		setEditCity(null);
		setSearch("");
		setIsResetForm(true);
	};

	const handleSelectedCity = (city: SlimCity): void => {
		setSelectedCity(city);
	};

	const handleOnClose = () => {
		if (isSubmitting) {
			return;
		}

		setSubmission(null);
		setSubmitError(null);
		resetFields();
		onClose();
	};

	if (!isOpen) {
		return <></>;
	}
	return (
		<div className="w-full h-full inset-0 fixed bg-gray-600 bg-opacity-80 z-50">
			<dialog
				open={isOpen}
				id="dialog"
				aria-label={
					submission
						? "Bestätigung der Einsendung"
						: "Formular zum Hinzufügen eines neuen Ortes"
				}
				className="mx-auto animate-show overflow-y-hidden backdrop:bg-red-300 relative top-16 bg-transparent max-w-2xl w-full px-4 md:px-0"
			>
				<div className="rounded-lg shadow mt-1 bg-white mx-auto">
					<header className="flex bg-green-normal rounded-t-lg items-start justify-between border-b align-start h-14">
						<img
							src="/parkfuchs.svg"
							width={64}
							role="img"
							alt={"logo"}
							aria-label="Parkfuchs Logo"
							className="relative left-2 top-0 select-none w-16"
						/>
						<div className="w-full p-2 pt-4 ml-1 relative">
							<h3 className="text-xl font-semibold text-gray-900">
								{submission
									? submission.isCorrection
										? "Danke für deinen Hinweis!"
										: "Danke, du Spürfuchs!"
									: editCity
									? "Falsche Info melden"
									: "Ort hinzufügen"}
							</h3>
							<button
								type="button"
								onClick={() => handleOnClose()}
								disabled={isSubmitting}
								aria-label="dialog schließen"
								className="text-gray-600 bg-transparent hover:text-gray-900 rounded-lg text-md p-1.5 m-1 ml-auto absolute top-[-4px] right-0 disabled:cursor-not-allowed disabled:opacity-40"
							>
								<FontAwesomeIcon icon={faXmark} size="xl" />
							</button>
						</div>
					</header>

					{isOpen && submission ? (
						<div className="px-6 py-10 max-md:px-5 text-center">
							<div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-light text-green-dark">
								<FontAwesomeIcon icon={faCircleCheck} size="3x" />
							</div>
							<p className="mx-auto max-w-lg text-lg leading-relaxed text-gray-800">
								{submission.isCorrection ? (
									<>
										Deine Meldung zu <b>{submission.cityName}</b> ist
										 sicher im Fuchsbau angekommen. Ein Mensch aus
										 unserem Team prüft nun, was korrigiert werden
										 muss.
									</>
								) : (
									<>
										Dein Vorschlag für <b>{submission.cityName}</b> ist
										 sicher im Fuchsbau angekommen. Bevor der Ort im
										 Verzeichnis erscheint, schaut ein Mensch aus
										 unserem Team in Ruhe darüber.
									</>
								)}
							</p>
							<p className="mt-4 text-gray-600">
								Das kann ein bisschen dauern. Danke für deine Geduld!
							</p>
							<button
								type="button"
								onClick={handleOnClose}
								className="mt-7 rounded-lg bg-green-normal px-6 py-3 font-medium text-black hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-green-dark"
							>
								Alles klar
							</button>
						</div>
					) : isOpen ? (
						<div className="p-6 pt-4 max-md:px-3 overflow-y-auto space-y-6 max-h-[85vh]">
							{!editCity && (
								<>
									<AutoCompleteInput
										initQuery={search}
										onSelectedCity={handleSelectedCity}
									/>
									{selectedCity?.exists && (
										<div className="bg-green-light p-3 rounded-lg text-black flex gap-4 items-center ">
											<FontAwesomeIcon
												size="2xl"
												icon={faCircleExclamation}
											/>
											<div>
												Du möchtest{" "}
												<b>{selectedCity.name}</b>{" "}
												eingeben? Hast du gesehen, dass
												die Stadt bereits im
												Parkfuchs-Verzeichnis existiert?
												<br />
												<div
													className="underline cursor-pointer mt-2"
													onClick={async () => {
														const city =
															await getCityById({
																data: {
																	cityId: selectedCity.id,
																},
															});

														if (!city) {
															return;
														}
														setEditCity(city);
													}}
												>
													Falsche Info melden
												</div>
											</div>
										</div>
									)}
								</>
							)}

							<Form
								selectedCity={selectedCity}
								doReset={isResetForm}
								isSubmitting={isSubmitting}
								submitError={submitError}
								onSubmit={onSubmit}
								onClose={handleOnClose}
							/>
						</div>
					) : null}
				</div>
			</dialog>
		</div>
	);
}
