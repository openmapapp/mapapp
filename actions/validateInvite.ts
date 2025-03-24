"use server";
import db from "@/db"; // Adjust path based on your project structure
import { error } from "console";

export async function validateInvite(inviteCode: string) {
  try {
    if (!inviteCode) return error("Invite code is required");

    // Check if the invite code exists in the database
    const invite = await db.inviteCode.findUnique({
      where: { code: inviteCode, isUsed: false },
    });

    if (!invite) {
      return "Invalid or previously used invite code";
    }

    // If the code is valid, return success
    await db.inviteCode.update({
      where: { code: inviteCode },
      data: { isUsed: true },
    });
    return true;
  } catch (error) {
    console.error("Error validating invite code:", error);
    return false;
  }
}
