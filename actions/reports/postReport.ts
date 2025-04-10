"use server";

import db from "../../db";
import { Prisma } from "@prisma/client";

interface ReportPayload {
  latitude: number;
  longitude: number;
  reportTypeId: number;
  userId: string | null;
  description?: string | Record<string, any>;
  isPermanent?: boolean;
  itemStatus?: "PRESENT" | "DEPARTED" | "UNKNOWN";
}

export async function postReport(payload: ReportPayload) {
  try {
    const {
      latitude,
      longitude,
      reportTypeId,
      userId,
      description = {},
      isPermanent = false,
      itemStatus = "PRESENT",
    } = payload;

    // Validate reportTypeId exists
    const reportType = await db.reportType.findUnique({
      where: { id: reportTypeId },
    });

    if (!reportType) {
      return {
        success: false,
        error: "Invalid report type",
      };
    }

    // Process description - handle both string and object inputs
    let parsedDescription: Prisma.JsonValue = Prisma.JsonNull;

    if (typeof description === "string") {
      try {
        // If it's a JSON string, parse it
        parsedDescription = JSON.parse(description);
      } catch (e) {
        // If it's not valid JSON, use it as is
        parsedDescription = description;
      }
    } else if (Object.keys(description).length > 0) {
      // If it's an object with keys, use it directly
      parsedDescription = description as Prisma.JsonObject;
    }

    // Create the report with included relations
    const report = await db.report.create({
      data: {
        lat: latitude,
        long: longitude,
        description: parsedDescription,
        image: null,
        trustScore: 1,
        submittedById: userId,
        reportTypeId,
        isPermanent: isPermanent,
        itemStatus: itemStatus,
      },
      include: {
        // Include full report type for immediate use in UI
        reportType: true,
        // Include submitter info but limit fields for privacy
        submittedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    console.log("Report posted successfully:", report.id);

    // Emit new report event via WebSocket with complete data
    try {
      await fetch("http://localhost:3005/api/new-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
        // Add timeout to prevent hanging if socket server is down
        signal: AbortSignal.timeout(2000),
      });
    } catch (socketError) {
      console.error("Error sending report to socket server:", socketError);
      // Continue anyway - report was created successfully in DB
    }

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    console.error("Error posting report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to post report",
    };
  }
}
