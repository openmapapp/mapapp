import { NextResponse } from "next/server";
import { getGlobalSettings } from "@/actions/globalSettings";

export async function GET() {
  try {
    const settings = await getGlobalSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
