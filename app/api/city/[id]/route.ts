import { NextRequest, NextResponse } from "next/server";
import { getCityById } from "../../../../db/city";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	const result = await getCityById(id);

	if (!result) {
		return NextResponse.json(
			{ msg: `City with id ${id} not found` },
			{ status: 404 }
		);
	}

	return NextResponse.json(result);
}
