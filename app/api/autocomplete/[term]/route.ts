import { NextRequest, NextResponse } from "next/server";
import { autocomplete } from "../../../../db/city";

export async function GET(_request: NextRequest, props) {
    const params = await props.params;

    const {
        term
    } = params;

    const results = await autocomplete(term, 20);
    return NextResponse.json(results);
}
