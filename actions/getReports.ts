"use server";

import db from "../db";

export async function getReports(timeRange: number = 4) {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - timeRange);

  // Fetch the report types from the database.
  const reports = await db.report.findMany({
    where: {
      createdAt: {
        gte: cutoffTime,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  // Map the result to a simpler array of objects if needed.
  return reports;
}
