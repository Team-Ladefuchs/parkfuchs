import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { NewCity, ResultCity } from "../db/types";
import { isValidUrl } from "../functions/utils";
import WebsiteAddField, { webKeyPattern } from "./WebsiteAddField";

export interface Properties {
	selectedCity: ResultCity | null;
	onSubmit: (city: NewCity) => Promise<void>;
	doReset: boolean;
	onClose: () => void;
}

const maxWebsiteLength = 4;

const initWebsiteInputs = ["website"];

export default function Form({
	selectedCity,
	onSubmit,
	doReset,
	onClose,
}: Properties): JSX.Element {
	const { register, handleSubmit, reset, getValues, setValue, watch } =
		useForm<NewCity>({
			defaultValues: {
				information: "",
				nonePrivileges: false,
				useBusLane: false,
				freeParking: true,
				parkingHours: 2,
				untilMaxMarkingHour: false,
				parkingDisk: false,
				withEMark: true,
				whileCharging: false,
				website: null,
			},
		});

	const [disableCanAddMoreWebsite, setDisableCanAddMoreWebsite] =
		useState(true);

	const [websiteExtrasInputs, setWebsiteExtrasInputs] =
		useState<string[]>(initWebsiteInputs);

	const showWebsitePlusBtn = (index: number): boolean =>
		websiteExtrasInputs.length === index + 1 &&
		websiteExtrasInputs.length < maxWebsiteLength;

	const canAddMoreWebsite = (website: string | null): boolean => {
		return (
			website === null ||
			website?.length === 0 ||
			!isValidUrl(website ?? "")
		);
	};

	const [formValid, setFormValid] = useState(false);

	useEffect(() => {
		if (doReset) {
			reset();
			setWebsiteExtrasInputs(initWebsiteInputs);
			setDisableCanAddMoreWebsite(true);
			setFormValid(false);
		}
	}, [reset, doReset]);

	const doValidate = (): boolean => {
		if (!selectedCity) {
			return false;
		}
		let { useBusLane, freeParking, whileCharging } = getValues();

		return freeParking || useBusLane || whileCharging;
	};

	useEffect(() => {
		setFormValid(doValidate());
	}, [selectedCity]);

	const validateForm = () => {
		let {
			website,
			untilMaxMarkingHour,
			nonePrivileges,
			whileCharging,
			freeParking,
		} = getValues();

		setDisableCanAddMoreWebsite(canAddMoreWebsite(website));

		if (!selectedCity) {
			setFormValid(false);
			return;
		}

		if (nonePrivileges) {
			setValue("freeParking", false);
			setValue("withEMark", false);
			setValue("parkingDisk", false);
			setValue("untilMaxMarkingHour", false);
			setValue("useBusLane", false);
			setValue("whileCharging", false);
			setValue("parkingHours", 0);
			setFormValid(true);
			return;
		}

		if (freeParking) {
			if (whileCharging) {
				setValue("freeParking", true);
				setValue("parkingHours", 2);
			}

			if (untilMaxMarkingHour) {
				setValue("freeParking", true);
				setValue("parkingHours", 0);
			}
		} else {
			setValue("parkingHours", 0);
			setValue("untilMaxMarkingHour", false);
			setValue("whileCharging", false);
		}

		setFormValid(doValidate());
	};

	const submitHandler = async () => {
		await onSubmit(getValues());
	};

	const formValue = watch();

	return (
		<form
			onSubmit={handleSubmit(submitHandler)}
			onChange={validateForm}
			className="space-y-6 flex flex-col"
		>
			{selectedCity && (
				<>
					<div>
						<div className="break-normal bg-lightGreen rounded-t-lg mb-[1px] p-4 px-8 max-md:p-2 max-md:px-4">
							<p className="font-bold mt-[3px]">
								{selectedCity?.name}
							</p>
							<p className="p-0 text-neutral-500 relative bottom-[3px] ">
								{selectedCity?.state}
							</p>
						</div>

						<div className="bg-lightGreen rounded-b-lg p-6 px-8 max-md:px-4">
							<section>
								<div className="mb-4 form-check flex content-center">
									<input
										className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-md bg-neutral-100 checked:bg-darkGreen checked:border-green  focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
										type="checkbox"
										aria-label="Keine Privilegien für Elektroautos Checkbox"
										id="nonePrivileges"
										{...register("nonePrivileges")}
									/>
									<label
										htmlFor="nonePrivileges"
										className="form-check-label text-md inline-block text-gray-800 mt-[3px]"
									>
										Keine Privilegien für Elektroautos
									</label>
								</div>
							</section>
							<div className="flex gap-16 max-md:flex-col max-md:gap-4">
								<section>
									<div>Privilegien (mind. 1)</div>
									<div className="mt-1 form-check flex content-center">
										<input
											className="form-check-input appearance-none h-5 w-5 border border-neutral-300 rounded-md bg-neutral-100 checked:bg-darkGreen checked:border-green  focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer disabled:opacity-50"
											{...register("freeParking")}
											type="checkbox"
											aria-label="Kostenlos parken Checkbox"
											disabled={formValue.nonePrivileges}
											id="freeParking"
										/>
										<label
											htmlFor="freeParking"
											className="form-check-label text-md inline-block text-gray-800 mt-[2px]"
										>
											Kostenlos parken
										</label>
										<input
											className="ml-1 bg-neutral-100 border border-green text-gray-800 rounded-lg  block w-16 py-0.5 px-2 focus:bg-white focus:outline-none focus:ring-2  focus:ring-green focus:border-transparent appearance-text disabled:opacity-50"
											disabled={
												formValue.untilMaxMarkingHour ||
												formValue.nonePrivileges
											}
											id="parkinHours"
											type="number"
											step={0.5}
											min={1}
											defaultValue={2}
											max={24}
											aria-label="Anzahl Kostenlos parken in Stunden Eingabefeld"
											{...register("parkingHours")}
										/>
										<span
											className={`mt-1 ml-1 ${
												formValue.untilMaxMarkingHour ||
												formValue.nonePrivileges
													? "opacity-50"
													: "opacity-100"
											}`}
										>
											Std.
										</span>
									</div>
									<div className="mt-1 ml-5 form-check flex content-center">
										<input
											className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-md bg-neutral-100 checked:bg-darkGreen checked:border-green  focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
											{...register("untilMaxMarkingHour")}
											disabled={formValue.nonePrivileges}
											type="checkbox"
											aria-label="bis zur angegeb. Höchstparkdauer Checkbox"
											id="untilMaxMarkingHour"
										/>
										<label
											htmlFor="untilMaxMarkingHour"
											className="form-check-label text-md inline-block text-gray-800 mt-[2px]"
										>
											bis zur angegeb. Höchstparkdauer
										</label>
									</div>
									<div className="mt-1 ml-5 form-check flex content-center">
										<input
											className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-md bg-neutral-100 checked:bg-darkGreen checked:border-green  focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
											{...register("whileCharging")}
											disabled={formValue.nonePrivileges}
											aria-label="während des Ladevorgangs Checkbox"
											type="checkbox"
											id="c"
										/>
										<label
											htmlFor="whileCharging"
											className="form-check-label text-md inline-block text-gray-800 mt-[2px]"
										>
											während des Ladevorgangs
										</label>
									</div>

									<div className="mt-1 form-check flex content-center">
										<input
											className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-md bg-neutral-100 checked:bg-darkGreen checked:border-green  focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
											{...register("useBusLane")}
											disabled={formValue.nonePrivileges}
											aria-label="Nutzung der Busspur erlaubt Checkbox"
											type="checkbox"
											id="busLane"
										/>
										<label
											htmlFor="busLane"
											className="form-check-label text-md inline-block text-gray-800 mt-[2px]"
										>
											Nutzung der Busspur erlaubt
										</label>
									</div>
								</section>

								<section>
									<div>Voraussetzungen</div>
									<div className="mt-2 form-check flex content-center">
										<input
											className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-md bg-neutral-100 checked:bg-darkGreen checked:border-green focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer disabled:opacity-50"
											{...register("withEMark")}
											disabled={formValue.nonePrivileges}
											aria-label="E-Kennzeichen Checkbox"
											type="checkbox"
											id="eMark"
										/>
										<label
											htmlFor="eMark"
											className="form-check-label text-md inline-block text-gray-800 mt-[2px]"
										>
											E-Kennzeichen
										</label>
									</div>
									<div className="mt-1 form-check flex content-center">
										<input
											className="form-check-input appearance-none h-5 w-5 border border-gray-300 rounded-md  bg-neutral-100 checked:bg-darkGreen checked:border-green focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer disabled:opacity-50"
											{...register("parkingDisk")}
											disabled={formValue.nonePrivileges}
											id="parkingDisk"
											aria-label="Parkscheibe Checkbox"
											type="checkbox"
										/>
										<label
											htmlFor="parkingDisk"
											className="form-check-label text-md inline-block text-gray-800 mt-[2px]"
										>
											Parkscheibe
										</label>
									</div>
								</section>
							</div>
						</div>
					</div>
					<div>
						<label
							htmlFor="website"
							className="block ml-[2px] mb-1 text-md font-semibold text-sm text-neutral-500 uppercase tracking-wide"
						>
							Quellen
						</label>

						<div className="grid gap-2">
							{websiteExtrasInputs
								.slice(0, maxWebsiteLength)
								.map((field: any, index: number) => {
									return (
										<div key={field}>
											<WebsiteAddField
												fieldName={field}
												isDisabled={
													disableCanAddMoreWebsite
												}
												showPlus={showWebsitePlusBtn(
													index
												)}
												registerFn={register}
												addMoreField={() => {
													setWebsiteExtrasInputs([
														...websiteExtrasInputs,
														`${webKeyPattern}${
															websiteExtrasInputs.length +
															1
														}`,
													]);
												}}
											/>
										</div>
									);
								})}
						</div>
					</div>
					<div>
						<label className="block mb-1 ml-[2px] text-md   dark:text-white font-semibold text-sm text-gray-500 uppercase tracking-wider">
							Freitext
						</label>
						<textarea
							id="message"
							rows={8}
							{...register("information", {
								maxLength: 800,
							})}
							aria-label="Freitext: Für den Fall, dass die obigen Felder nicht ausreichen"
							className="block p-2.5 w-full max-h-full text-gray-900 bg-neutral-100 rounded-lg border border-gray-200 focus:border-green max-h-22 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green focus:border-transparent "
							placeholder="Für den Fall, dass die obigen Felder nicht ausreichen (max. 800 Zeichen)"
						></textarea>
					</div>
				</>
			)}
			<div className="flex gap-2 items-center space-x-2">
				<button
					disabled={!formValid}
					data-modal-toggle="defaultModal"
					aria-label="Formular Speichern"
					type="submit"
					className="text-black bg-green hover:bg-darkGreen focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-3 text-center disabled:opacity-50 disabled:hover:bg-green"
				>
					Speichern
				</button>
				<button
					data-modal-toggle="defaultModal"
					type="reset"
					aria-label="dialog schließen"
					onClick={onClose}
					className="text-black bg-green hover:bg-darkGreen focus:ring-4 focus:outline-none font-medium rounded-lg text-md px-5 py-3 text-center "
				>
					Abbrechen
				</button>
			</div>
		</form>
	);
}
