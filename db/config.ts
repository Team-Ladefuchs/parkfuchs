import { pocketBaseInstance } from "./city";
import { Config } from "./types";

export async function getTGHLink(): Promise<string> {
	const defaultTGH = "https://xn--geld-fr-eauto-1ob.de/ref/Parkfuchs45";
	try {
		const pocketBase = await pocketBaseInstance();
		const result = await pocketBase
			.collection("config")
			.getFirstListItem<Config>("field = 'tghLink'", {});
		return result.value ?? defaultTGH;
	} catch (error: Error | any) {
		console.error("[getTGHLink]", error.message);
	}
	return defaultTGH;
}
