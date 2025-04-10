"use server";

import db from "../../db";
import type { Session } from "@/app/lib/auth-client";
import { requireRole } from "@/app/lib/requireRole";

interface ConfirmPayload {
  reportId: number;
  isConfirmed: boolean;
}

/**
 * Server action to confirm or dispute a report
 * Only admins and moderators can confirm reports
 */
export async function confirmReport(session: Session, payload: ConfirmPayload) {
  try {
    const { reportId, isConfirmed } = payload;

    if (!reportId) {
      return {
        success: false,
        error: "Report ID is required",
      };
    }

    // Check if user is authorized (admin or moderator)
    requireRole(session, "moderator");

    // Find the report to verify
    const report = await db.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return {
        success: false,
        error: "Report not found",
      };
    }

    // Update the report verification status
    const updatedReport = await db.report.update({
      where: { id: reportId },
      data: {
        reportStatus: isConfirmed ? "CONFIRMED" : "DISPUTED",
        // If being verified, ensure it's visible
        ...(isConfirmed ? { isVisible: true } : {}),
      },
    });

    // Log the verification action
    console.log(
      `Report ${reportId} ${isConfirmed ? "confirmed" : "disputed"} by ${
        session.user.name || session.user.id
      }`
    );

    return {
      success: true,
      data: updatedReport,
    };
  } catch (error) {
    console.error("Error confirming report:", error);
    return {
      success: false,
      error: "Failed to confirm report",
    };
  }
}

// actions/reports/confirmReport.ts (add this function)
export async function markReportResolved(session: any, reportId: number) {
  try {
    // Check if user is an admin or moderator
    if (
      session?.user?.role !== "admin" &&
      session?.user?.role !== "moderator"
    ) {
      return {
        success: false,
        error: "Unauthorized. Only admins and moderators can resolve reports.",
      };
    }

    // Update the report status
    const report = await db.report.update({
      where: { id: reportId },
      data: {
        reportStatus: "RESOLVED",
        // Create a status change record
        statusChanges: {
          create: {
            previousStatus: "ACTIVE", // We don't know the previous status here, so default to ACTIVE
            newStatus: "RESOLVED",
            previousItemStatus: "PRESENT", // Same issue, default to PRESENT
            newItemStatus: "DEPARTED", // When resolved, mark as departed
            changedById: session.user.id,
            reason: "Manually resolved by moderator",
          },
        },
      },
    });

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    console.error("Error resolving report:", error);
    return {
      success: false,
      error: "Failed to resolve report",
    };
  }
}

// actions/reports/confirmReport.ts (add this function)
export async function hideReport(session: any, reportId: number) {
  try {
    // Check if user is an admin or moderator
    if (
      session?.user?.role !== "admin" &&
      session?.user?.role !== "moderator"
    ) {
      return {
        success: false,
        error: "Unauthorized. Only admins and moderators can hide reports.",
      };
    }

    // Update the report status
    const report = await db.report.update({
      where: { id: reportId },
      data: {
        isVisible: false,
        reportStatus: "INCORRECT",
        // Create a status change record
        statusChanges: {
          create: {
            previousStatus: "ACTIVE", // Default
            newStatus: "INCORRECT",
            previousItemStatus: "PRESENT", // Default
            newItemStatus: "UNKNOWN", // We don't know if it's there or not
            changedById: session.user.id,
            reason: "Removed by moderator - likely spam or invalid",
          },
        },
      },
      include: {
        // Include these to match the format of your normal reports
        reportType: true,
        submittedBy: {
          select: {
            id: true,
            username: true,
          },
        },
        votes: true,
      },
    });

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    console.error("Error hiding report:", error);
    return {
      success: false,
      error: "Failed to hide report",
    };
  }
}

export async function getReportsForModeration(hours: number = 24) {
  try {
    // Check if the current user is an admin or moderator
    // You can add this check if needed

    const timeAgo = new Date();
    timeAgo.setHours(timeAgo.getHours() - hours);

    // Query that includes ALL reports in the time frame, regardless of visibility
    return await db.report.findMany({
      where: {
        createdAt: {
          gte: timeAgo,
        },
        // No filter on isVisible, so it includes all reports
        // No filter on itemStatus, so it includes all statuses
      },
      include: {
        reportType: true,
        submittedBy: {
          select: {
            id: true,
            username: true,
          },
        },
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching reports for moderation:", error);
    throw error;
  }
}
