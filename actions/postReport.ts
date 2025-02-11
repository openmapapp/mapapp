"use server";

import db from "../db";

interface ReportPayload {
  latitude: number;
  longitude: number;
  reportTypeId: number;
  trustScore: number;
  userId: string;
  description: Record<string, string> | null; // ✅ Ensuring it's an object
}

export async function postReport(payload: ReportPayload) {
  try {
    const {
      latitude,
      longitude,
      reportTypeId,
      trustScore,
      userId,
      description,
    } = payload;

    const image = null;

    const report = await db.report.create({
      data: {
        lat: latitude,
        long: longitude,
        description: JSON.stringify(description) ?? null,
        image: image ?? null,
        trustScore,
        submittedById: userId,
        reportTypeId,
      },
    });

    console.log("Report posted:", report);

    // Emit new report event via WebSocket
    await fetch("http://localhost:3005/api/new-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(report),
    });

    return report;
  } catch (error) {
    console.error(error);
    return { error: "Failed to post report" };
  }
}
