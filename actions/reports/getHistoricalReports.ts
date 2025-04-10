"use server";

import db from "@/db";
import { create } from "domain";

export async function getHistoricalReports(
  fromDate: Date,
  toDate: Date,
  showDepartedItems: boolean
) {
  // Ensure the time is set correctly for proper date range
  const startDate = new Date(fromDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(toDate);
  endDate.setHours(23, 59, 59, 999);

  console.log(
    `Fetching historical reports from ${startDate.toISOString()} to ${endDate.toISOString()}`
  );

  const whereClause: any = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  };

  // Only apply visibility/status filters if not showing departed items
  if (!showDepartedItems) {
    whereClause.isVisible = true; // Only get visible reports
    whereClause.itemStatus = { not: "DEPARTED" }; // Exclude departed items
  }

  // Fetch reports within the specified date range
  const reports = await db.report.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reportType: {
        select: {
          id: true,
          name: true,
          iconUrl: true,
          reportTypeFields: {
            orderBy: {
              order: "asc",
            },
          },
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

  console.log(`Found ${reports.length} historical reports`);

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
