import { NextRequest, NextResponse } from "next/server";
import { getNewestEnabledInboxCities } from "../../../db/city";

export async function GET(_request: NextRequest) {
	return NextResponse.json(await getNewestEnabledInboxCities());
}
