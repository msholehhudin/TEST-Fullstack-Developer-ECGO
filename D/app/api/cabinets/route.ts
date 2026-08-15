import getCabinets from "@/lib/queries/cabinets";
import { GetCabinetsParams } from "@/lib/types/cabinets";
import { getCabinetsSchema } from "@/lib/validations/cabinet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    const params = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    )

    const parsed = getCabinetsSchema.parse(params)
    const result = await getCabinets(parsed)

    return NextResponse.json({result});
  } catch (error) {
    console.error("Failed to fetch cabinets:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch cabinets",
      },
      {
        status: 500,
      }
    );
  }
}