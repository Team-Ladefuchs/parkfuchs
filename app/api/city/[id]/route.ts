import { NextRequest, NextResponse } from "next/server";
import { getCityById } from "../../../../db/city";

export async function GET(_request: NextRequest, props) {
    const params = await props.params;

    const {
        id
    } = params;

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
