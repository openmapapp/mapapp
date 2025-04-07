"use server";

import db from "../../db";

export async function getUserVotes(userId, reportId) {
  // Fetch the user's vote for this report.
  const userVote = await db.vote.findUnique({
    where: {
      userId_reportId: { userId, reportId },
    },
  });

  if (!userVote) {
    return null;
  }
  // Map the result to a simpler array of objects if needed.
  return userVote;
}
