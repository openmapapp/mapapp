// pages/api/cron/decay-reports.ts
import { NextApiRequest, NextApiResponse } from "next";
import { decayReportStatus } from "@/actions/reports/decayReport";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify authorization (optional but recommended)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Run the decay function
    const result = await decayReportStatus();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Successfully updated ${result.updatedCount} reports`,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in decay-reports API route:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
