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

    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return { success: true };
  } catch (error) {
    return { error: error };
  }
}
