import { NextRequest, NextResponse } from "next/server";
import { search } from "../../../../db/city";

export async function GET(_request: NextRequest, { params: { term } }) {
	return NextResponse.json(await search(term, 14));
}
