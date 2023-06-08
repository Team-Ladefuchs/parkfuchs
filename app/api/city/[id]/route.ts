import { NextRequest, NextResponse } from "next/server";
import { getCityById } from "../../../../db/city";

export async function GET(_request: NextRequest, { params: { id } }) {
	const result = await getCityById(id);

	if (!result) {
		return NextResponse.json(
			{
				msg: `city with ${id} not found`,
			},
			{
				status: 404,
			}
		);
	}

	return NextResponse.json(result);
}
