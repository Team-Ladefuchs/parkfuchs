import { createServerFn } from "@tanstack/react-start";
import * as city from "@/db/city.server";
import { type NewCity } from "@/db/types";

export const getEnabledInboxCities = createServerFn({ method: "GET" }).handler(
	() => city.getEnabledInboxCities()
);

export const getCityCount = createServerFn({ method: "GET" }).handler(() =>
	city.getCityCount()
);

export const getCitiesWithPrivileges = createServerFn({ method: "GET" }).handler(
	() => city.getCitiesWithPrivileges()
);

export const getCityById = createServerFn({ method: "GET" })
	.validator((data: { cityId: string }) => data)
	.handler(({ data }) => city.getCityById(data.cityId));

export const search = createServerFn({ method: "GET" })
	.validator((data: { query: string; maxResults: number }) => data)
	.handler(({ data }) => city.search(data.query, data.maxResults));

export const autocomplete = createServerFn({ method: "GET" })
	.validator((data: { query: string; maxResults: number }) => data)
	.handler(({ data }) => city.autocomplete(data.query, data.maxResults));

export const saveCity = createServerFn({ method: "POST" })
	.validator((data: NewCity) => data)
	.handler(({ data }) => city.saveCity(data));
