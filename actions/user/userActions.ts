"use server";

import db from "../../db";

export async function handleDeletedUser(userId: string) {
  try {
    // Update reports to anonymize them rather than delete
    const updated = await db.report.updateMany({
      where: { submittedById: userId },
      data: {
        submittedById: null,
        // Optionally store original ID in a separate field for audit purposes
        deletedUserId: userId,
      },
    });

    return {
      success: true,
      count: updated.count,
    };
  } catch (error) {
    console.error("Error handling deleted user's reports:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update reports for deleted user",
    };
  }
}
