"use server";

import db from "../../db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";

export async function deleteReport(reportId: string, session: Session | null) {
  try {
    if (!session) return { error: "Unauthorized: No user session" };

    const reportIdNumber = Number(reportId);

    const report = await db.report.findUnique({
      where: { id: reportIdNumber },
    });

    if (!report) return { error: "Report not found" };

    const isOwner = report.submittedById === session.user.id;

    if (!isOwner) {
      requireRole(session, "moderator");
    } else {
      return { error: "Unauthorized" };
    }

    await db.report.delete({
      where: { id: reportIdNumber },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error deleting report" };
  }
}
