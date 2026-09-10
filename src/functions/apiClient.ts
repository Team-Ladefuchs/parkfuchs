import { type CityApiResponse, rawCitySchema } from "@/db/types";

export async function getCitiesWithPrivilegesHttp(): Promise<CityApiResponse> {
	const response = await fetch("/api/city");

	if (!response.ok) {
		throw new Error(
			`[getCitiesWithPrivilegesHttp] Request failed with status ${response.status}`,
		);
	}

	const body: unknown = await response.json();
	const parsed = rawCitySchema.array().safeParse(body);

	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		throw new Error(
			`[getCitiesWithPrivilegesHttp] /api/city contract violation at <${issue?.path.join(".")}>: ${issue?.message}`,
		);
	}

	return parsed.data;
}
