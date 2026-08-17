
import getCabinetDetail from "@/lib/queries/cabinet-detail";
import { cabinetIdSchema } from "@/lib/validations/cabinet-detail";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = cabinetIdSchema.parse(id);

    const detail = await getCabinetDetail(parsedId);

    if (!detail) {
      return NextResponse.json(
        { error: "Cabinet not found" },
        { status: 404 }
      );
    }

    // Flat shape, matching the documented contract directly — not wrapped
    // in a `{ result }` envelope like the list route currently is.
    return NextResponse.json(detail);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid cabinet id" },
        { status: 400 }
      );
    }

    console.error("Failed to fetch cabinet detail:", error);

    return NextResponse.json(
      { error: "Failed to fetch cabinet detail" },
      { status: 500 }
    );
  }
}
