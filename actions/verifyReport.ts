"use server";

import db from "../db";
import type { Session } from "@/app/lib/auth-client";
import { requireRole } from "@/app/lib/requireRole";

interface VerifyPayload {
  reportId: number;
  isVerified: boolean;
}

/**
 * Server action to verify or unverify a report
 * Only admins and moderators can verify reports
 */
export async function verifyReport(session: Session, payload: VerifyPayload) {
  try {
    const { reportId, isVerified } = payload;

    if (!reportId) {
      return {
        success: false,
        error: "Report ID is required",
      };
    }

    // Check if user is authorized (admin or moderator)
    if (
      !session ||
      !session.user ||
      !["admin", "moderator"].includes(session.user.role)
    ) {
      return {
        success: false,
        error: "Unauthorized: Only admins and moderators can verify reports",
      };
    }

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
        isVerified,
        // If being verified, ensure it's visible
        ...(isVerified ? { isVisible: true } : {}),
      },
    });

    // Log the verification action
    console.log(
      `Report ${reportId} ${isVerified ? "verified" : "unverified"} by ${
        session.user.name || session.user.id
      }`
    );

    return {
      success: true,
      data: updatedReport,
    };
  } catch (error) {
    console.error("Error verifying report:", error);
    return {
      success: false,
      error: "Failed to verify report",
    };
  }
}
