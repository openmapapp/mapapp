"use server";

import db from "../../db";
import { Prisma } from "@prisma/client";

interface ReportPayload {
  latitude: number;
  longitude: number;
  reportTypeId: number;
  userId: string;
  description?: Record<string, string>;
}

export async function postReport(payload: ReportPayload) {
  try {
    const {
      latitude,
      longitude,
      reportTypeId,
      userId,
      description = {},
    } = payload;

    const image = null;

    const report = await db.report.create({
      data: {
        lat: latitude,
        long: longitude,
        description: Object.keys(description).length
          ? (description as Prisma.JsonObject)
          : Prisma.JsonNull,
        image: image ?? null,
        trustScore: 1,
        submittedById: userId || null,
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
    console.error("Error posting report", error);
    return { error: "Failed to post report" };
  }
}

export async function handleDeletedUser(userId: string) {
  try {
    await db.report.updateMany({
      where: { submittedById: userId },
      data: { deletedUserId: userId },
    });
  } catch (error) {
    console.error("Error deleting user", error);
    return { error: "Failed to delete user" };
  }
}
