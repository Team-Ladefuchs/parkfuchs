import { createFileRoute } from "@tanstack/react-router";
import { getCitiesWithPrivileges } from "@/db/city.functions";
import { type CityApiResponse } from "@/db/types";

export const Route = createFileRoute("/api/city")({
	server: {
		handlers: {
			GET: async () => {
				const result: CityApiResponse =
					await getCitiesWithPrivileges();
				return Response.json(result);
			},
		},
	},
});
