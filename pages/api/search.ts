import type { NextApiRequest, NextApiResponse } from "next";
import { search } from "../../db/city";
import { HttpError, InboxCity } from "../../db/types";

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<InboxCity[] | HttpError>
) {
	const {
		query: { query },
		method,
	} = request;

	if (method !== "GET") {
		return response.status(400).json({
			status: 400,
			message: "Bad method",
		});
	}

	const results = await search(query as string);

	response.status(200).json(results);
}
