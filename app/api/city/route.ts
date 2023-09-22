import { NextRequest, NextResponse } from "next/server";
import { getCitiesWithPrivileges } from "../../../db/city";

export async function GET(_request: NextRequest) {
	const result = await getCitiesWithPrivileges();
	return NextResponse.json(result);
}
