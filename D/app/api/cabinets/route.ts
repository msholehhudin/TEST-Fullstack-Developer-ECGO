import { NextResponse } from "next/server";
import { getCabinets } from "@/lib/queries/cabinets";

export async function GET() {
  try {
    const cabinets = await getCabinets();

    return NextResponse.json({
      data: cabinets,
    });
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