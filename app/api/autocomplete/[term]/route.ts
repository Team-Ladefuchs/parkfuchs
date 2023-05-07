import { NextRequest, NextResponse } from "next/server";
import { autocomplete } from "../../../../db/city";

export async function GET(_request: NextRequest, { params: { term } }) {
	const results = await autocomplete(term, 20);
	return NextResponse.json(results);
}
