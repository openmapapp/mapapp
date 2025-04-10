import db from "../../db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";

export async function updateUserRole(
  adminSession: Session,
  userId: string,
  newRole: "user" | "moderator" | "admin"
) {
  try {
    requireRole(adminSession, "admin"); // Restrict to admins only

    // Check if the user is trying to remove the last admin
    const numberOfAdmins = await db.user.count({
      where: { role: "admin" },
    });

    if (newRole === "user" && numberOfAdmins <= 1) {
      return {
        error: "Cannot remove the last admin. At least one admin is required.",
      };
    }

    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return { error: "User not found" };
    }

    // Check if the new role is the same as the current role
    if (user.role === newRole) {
      return { error: "User already has this role" };
    }

    // Update the user's role
    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return { success: true };
  } catch (error) {
    return { error: error };
  }
}
