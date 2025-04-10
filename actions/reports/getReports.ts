"use server";

import db from "@/db";

export async function getReports(
  timeRange: number = 4,
  includeNonVisible = false
) {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - timeRange);

  const whereClause: any = {
    createdAt: {
      gte: cutoffTime,
    },
  };

  if (!includeNonVisible) {
    whereClause.isVisible = true; // Only get visible reports
    whereClause.itemStatus = { not: "DEPARTED" }; // Exclude departed items
  }

  // Fetch reports with report type information included
  const reports = await db.report.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reportType: true,
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
  return reports.map((report) => {
    // Get fields from reportTypeFields and format them
    let fields = "[]";
    if (
      report.reportType.reportTypeFields &&
      report.reportType.reportTypeFields.length > 0
    ) {
      // Convert reportTypeFields to the legacy fields format
      const fieldsArray = report.reportType.reportTypeFields.map((field) => ({
        id: field.id.toString(),
        name: field.name,
        label: field.label,
        type: field.type,
        options: field.options ? JSON.parse(field.options) : undefined,
        required: field.required,
        order: field.order,
      }));
      fields = JSON.stringify(fieldsArray);
    }

    return {
      ...report,
      lastSighting: report.votes.length > 0 ? report.votes[0].createdAt : null,
      // Make sure report type is correctly populated with fields
      reportType: {
        id: report.reportType.id,
        name: report.reportType.name,
        fields: fields, // Convert back to string format expected by client
        iconUrl: report.reportType.iconUrl || null,
      },
    };
  });
}
