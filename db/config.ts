import { pocketBase } from "./city";
import { Config } from "./types";

export async function getTGHLink(): Promise<string> {
	const result = await pocketBase
		.collection("config")
		.getFirstListItem<Config>("field = 'tghLink'", {});
	return result.value ?? "https://xn--geld-fr-eauto-1ob.de/ref/Parkfuchs45";
}
