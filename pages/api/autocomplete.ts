import type { NextApiRequest, NextApiResponse } from "next";
import { autocomplete } from "../../db/city";
import { HttpError, ResultCity } from "../../db/types";

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<ResultCity[] | HttpError>
) {
	const {
		query: { filter },
		method,
	} = request;

	if (method !== "GET") {
		return response.status(400).json({
			status: 400,
			message: "Bad method",
		});
	}

	const results = await autocomplete(filter as string, 20);

	response.status(200).json(results);
}
