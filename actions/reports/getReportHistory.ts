"use server";

import db from "@/db";

export async function getReportHistory(reportId: number) {
  try {
    // Validate the ID
    if (!reportId || isNaN(reportId)) {
      return {
        success: false,
        error: "Invalid report ID",
      };
    }

    // Fetch the report status changes
    const statusChanges = await db.reportStatusChange.findMany({
      where: {
        reportId: reportId,
      },
      include: {
        changedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch the report votes with info on who voted
    const votes = await db.vote.findMany({
      where: {
        reportId: reportId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return both datasets
    return {
      success: true,
      data: {
        statusChanges,
        votes,
      },
    };
  } catch (error) {
    console.error("Error fetching report history:", error);
    return {
      success: false,
      error: "Failed to fetch report history",
    };
  }
}
