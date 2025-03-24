"use server";

import db from "../db";
import { requireRole } from "@/app/lib/requireRole";

export async function updateReport(reportId, updatedData, session) {
  const report = await db.report.findUnique({
    where: { id: reportId },
  });

  if (!report) throw new Error("Report not found");

  if (
    session.user.id !== report.submittedById &&
    session.user.role !== "admin" &&
    session.user.role !== "moderator"
  ) {
    throw new Error("Unauthorized");
  }

  return await db.report.update({
    where: { id: reportId },
    data: {
      reportType: { connect: { id: updatedData.reportTypeId } },
      description: updatedData?.dynamicFields
        ? JSON.stringify(updatedData.dynamicFields)
        : "{}",
    },
  });
}
