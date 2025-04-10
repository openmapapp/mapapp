"use server";

import db from "../../db";
import { ReportStatus, ItemStatus } from "@prisma/client";

interface VotePayload {
  reportId: number;
  userId: string;
  voteType: number;
}

export async function voteOnReport(payload: VotePayload) {
  const { userId, reportId, voteType } = payload;

  try {
    if (!reportId || !userId || !voteType) {
      console.error("Invalid payload:", payload);
      return { error: "Invalid payload" };
    }

    // First, get the current report to check its status
    const report = await db.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        confirmationCount: true,
        disconfirmationCount: true,
        reportStatus: true,
        itemStatus: true,
        isPermanent: true,
        createdAt: true,
        departedAt: true,
      },
    });

    if (!report) {
      return { error: "Report not found" };
    }

    const existingVote = await db.vote.findUnique({
      where: {
        userId_reportId: { userId, reportId },
      },
    });

    // Create status change record function
    const createStatusChange = async (
      previousStatus: ReportStatus,
      newStatus: ReportStatus,
      previousItemStatus: ItemStatus,
      newItemStatus: ItemStatus,
      reason?: string
    ) => {
      await db.reportStatusChange.create({
        data: {
          reportId,
          previousStatus,
          newStatus,
          previousItemStatus,
          newItemStatus,
          changedById: userId,
          reason: reason || "Vote-based automatic status change",
        },
      });
    };

    // Process the vote
    if (!existingVote) {
      // New vote
      await db.vote.create({
        data: {
          userId,
          reportId,
          value: voteType,
        },
      });

      // Update confirmation counts
      if (voteType === 1) {
        await db.report.update({
          where: { id: reportId },
          data: { confirmationCount: { increment: 1 } },
        });
      } else {
        await db.report.update({
          where: { id: reportId },
          data: { disconfirmationCount: { increment: 1 } },
        });
      }
    } else if (existingVote.value !== voteType) {
      // User switching votes
      await db.vote.update({
        where: { userId_reportId: { userId, reportId } },
        data: { value: voteType },
      });

      // Update confirmation counts
      if (voteType === 1) {
        await db.report.update({
          where: { id: reportId },
          data: {
            confirmationCount: { increment: 1 },
            disconfirmationCount: { decrement: 1 },
          },
        });
      } else {
        await db.report.update({
          where: { id: reportId },
          data: {
            confirmationCount: { decrement: 1 },
            disconfirmationCount: { increment: 1 },
          },
        });
      }
    } else {
      // User clicked the same vote again to delete it
      await db.vote.delete({
        where: { userId_reportId: { userId, reportId } },
      });

      // Update confirmation counts
      if (voteType === 1) {
        await db.report.update({
          where: { id: reportId },
          data: { confirmationCount: { decrement: 1 } },
        });
      } else {
        await db.report.update({
          where: { id: reportId },
          data: { disconfirmationCount: { decrement: 1 } },
        });
      }
    }

    // Refetch the updated report after vote changes
    const updatedReport = await db.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        confirmationCount: true,
        disconfirmationCount: true,
        reportStatus: true,
        itemStatus: true,
        isPermanent: true,
      },
    });

    if (!updatedReport) {
      return { error: "Failed to update report" };
    }

    // Status change logic based on votes
    let newReportStatus = updatedReport.reportStatus;
    let newItemStatus = updatedReport.itemStatus;
    const previousReportStatus = report.reportStatus;
    const previousItemStatus = report.itemStatus;
    let statusChanged = false;

    // Auto-confirm report if enough people confirm it
    if (
      updatedReport.confirmationCount >= 5 &&
      updatedReport.reportStatus !== "CONFIRMED"
    ) {
      newReportStatus = "CONFIRMED";
      statusChanged = true;
    }

    // Mark report as disputed if enough people disagree
    if (
      updatedReport.disconfirmationCount >= 5 &&
      updatedReport.reportStatus !== "DISPUTED"
    ) {
      newReportStatus = "DISPUTED";
      newItemStatus = "DEPARTED";
      statusChanged = true;
    }

    // If there are both confirmations and disconfirmations, but more confirmations
    if (
      updatedReport.confirmationCount > 0 &&
      updatedReport.disconfirmationCount > 0 &&
      updatedReport.confirmationCount > updatedReport.disconfirmationCount * 2
    ) {
      if (updatedReport.reportStatus !== "CONFIRMED") {
        newReportStatus = "CONFIRMED";
        statusChanged = true;
      }
    }

    // If there are both confirmations and disconfirmations, but more disconfirmations
    if (
      updatedReport.confirmationCount > 0 &&
      updatedReport.disconfirmationCount > 0 &&
      updatedReport.disconfirmationCount > updatedReport.confirmationCount * 2
    ) {
      if (updatedReport.reportStatus !== "DISPUTED") {
        newReportStatus = "DISPUTED";
        newItemStatus = "DEPARTED";
        statusChanged = true;
      }
    }

    // If the item has been reported as not present and it's confirmed
    if (
      voteType === -1 &&
      updatedReport.disconfirmationCount >= 3 &&
      updatedReport.itemStatus !== "DEPARTED"
    ) {
      newItemStatus = "DEPARTED";

      // Record the departure time
      const now = new Date();
      await db.report.update({
        where: { id: reportId },
        data: {
          departedAt: now,
        },
      });

      statusChanged = true;
    }

    // If the status has changed, update the report
    if (statusChanged) {
      await db.report.update({
        where: { id: reportId },
        data: {
          reportStatus: newReportStatus,
          itemStatus: newItemStatus,
          // If item is departed, make it not visible
          isVisible: newItemStatus === "DEPARTED" ? false : true,
        },
      });

      // Create a status change record
      await createStatusChange(
        previousReportStatus,
        newReportStatus,
        previousItemStatus,
        newItemStatus,
        "Automatic status change based on votes"
      );
    }

    return {
      success: true,
      reportStatus: newReportStatus,
      itemStatus: newItemStatus,
    };
  } catch (error) {
    console.error("Error voting on report:", error);
    return { error: "Failed to vote on report" };
  }
}
