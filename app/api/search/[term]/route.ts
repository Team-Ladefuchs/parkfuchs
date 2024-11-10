import { NextRequest, NextResponse } from "next/server";
import { search } from "../../../../db/city";

export async function GET(_request: NextRequest, props) {
    const params = await props.params;

    const {
        term
    } = params;

    return NextResponse.json(await search(term, 15));
}