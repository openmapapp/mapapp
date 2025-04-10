"use server";

import db from "../../db";

// Function to automatically decay status of non-permanent reports
export async function decayReportStatus() {
  try {
    const now = new Date();

    // Find non-permanent reports that haven't been updated in a while
    // and are still marked as PRESENT
    const reports = await db.report.findMany({
      where: {
        isPermanent: false,
        itemStatus: "PRESENT",
        // Last updated more than 7 days ago
        updatedAt: {
          lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        // OR last confirmed more than 7 days ago
        OR: [
          {
            // Has votes but last vote was more than 7 days ago
            votes: {
              some: {
                createdAt: {
                  lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        reportStatus: true,
        itemStatus: true,
      },
    });

    // Update each report to UNKNOWN status
    for (const report of reports) {
      await db.report.update({
        where: { id: report.id },
        data: {
          itemStatus: "UNKNOWN",
          // Don't change report status, just the item status
        },
      });

      // Create status change record
      await db.reportStatusChange.create({
        data: {
          reportId: report.id,
          previousStatus: report.reportStatus,
          newStatus: report.reportStatus, // Status doesn't change
          previousItemStatus: report.itemStatus,
          newItemStatus: "UNKNOWN",
          reason: "Automatic decay - no recent confirmations",
        },
      });
    }

    return {
      success: true,
      updatedCount: reports.length,
    };
  } catch (error) {
    console.error("Error in decay function:", error);
    return {
      success: false,
      error: "Failed to update report statuses",
    };
  }
}
