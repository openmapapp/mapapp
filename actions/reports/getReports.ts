"use server";

import db from "@/db";

export async function getReports(timeRange: number = 4) {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - timeRange);

  // Fetch reports with report type information included
  const reports = await db.report.findMany({
    where: {
      createdAt: {
        gte: cutoffTime,
      },
      isVisible: true, // Only get visible reports
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reportType: {
        select: {
          id: true,
          name: true,
          fields: true,
          iconUrl: true,
        },
      },
      submittedBy: {
        select: {
          id: true,
          username: true,
        },
      },
      votes: {
        where: { value: 1 },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  // Process the reports to include all necessary information
  return reports.map((report) => ({
    ...report,
    lastSighting: report.votes.length > 0 ? report.votes[0].createdAt : null,
    // Make sure report type is correctly populated
    reportType: {
      id: report.reportType.id,
      name: report.reportType.name,
      fields: report.reportType.fields,
      iconUrl: report.reportType.iconUrl || null,
    },
  }));
}
