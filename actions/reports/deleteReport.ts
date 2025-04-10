"use server";

import db from "../../db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";
import { revalidatePath } from "next/cache";

export async function deleteReport(reportId: string, session: Session | null) {
  try {
    if (!session)
      return {
        success: false,
        error: "Unauthorized: No user session",
      };

    const reportIdNumber = Number(reportId);
    if (isNaN(reportIdNumber)) {
      return {
        success: false,
        error: "Invalid report ID",
      };
    }

    const report = await db.report.findUnique({
      where: { id: reportIdNumber },
    });

    if (!report)
      return {
        success: false,
        error: "Report not found",
      };

    // Check authorization - either user is owner or has moderator/admin role
    const isOwner = report.submittedById === session.user.id;
    const isAdminOrMod =
      session.user.role === "admin" || session.user.role === "moderator";

    if (!isOwner && !isAdminOrMod) {
      return {
        success: false,
        error: "You are not authorized to delete this report",
      };
    }

    // Delete the report
    await db.report.delete({
      where: { id: reportIdNumber },
    });

    // Revalidate the path after deletion
    revalidatePath("/");

    // Return success response
    return {
      success: true,
      message: "Report deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error deleting report",
    };
  }
}
