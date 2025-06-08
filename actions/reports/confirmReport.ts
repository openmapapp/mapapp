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
