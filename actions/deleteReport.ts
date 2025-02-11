"use server";

import db from "../db";

export async function deleteReport(reportId: string, userId: string) {
  const report = await db.report.findUnique({
    where: { id: reportId },
  });

  if (!report) return { error: "Report not found" };
  if (report.submittedById !== userId) return { error: "Unauthorized" };

  // ✅ Delete the report
  await db.report.delete({
    where: { id: reportId },
  });

  return { success: true };
}
