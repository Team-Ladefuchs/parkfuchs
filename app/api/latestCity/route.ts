import { NextRequest, NextResponse } from "next/server";
import { getEnabledInboxCities } from "../../../db/city";

export async function GET(_request: NextRequest) {
	return NextResponse.json(await getEnabledInboxCities());
}
