"use server";

import db from "../db";
import { getGlobalSettings } from "./globalSettings";

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

    const existingVote = await db.vote.findUnique({
      where: {
        userId_reportId: { userId, reportId },
      },
    });

    if (!existingVote) {
      await db.vote.create({
        data: {
          userId,
          reportId,
          value: voteType,
        },
      });

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

    const updatedReport = await db.report.findUnique({
      where: { id: reportId },
    });

    if (updatedReport && updatedReport.disconfirmationCount >= 5) {
      await db.report.update({
        where: { id: reportId },
        data: { isVisible: false },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error voting on report:", error);
    return { error: "Failed to vote on report" };
  }
}
