"use server";

import db from "@/db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";

// Update Global Settings
export async function updateGlobalSettings(session: Session, updatedSettings) {
  requireRole(session, "admin");

  const { id, ...settingWithoutId } = updatedSettings;

  return await db.globalSettings.update({
    where: { id: 1 },
    data: settingWithoutId,
  });
}

// Fetch all users for admin panel user table
export async function fetchUsers(session: Session) {
  requireRole(session, "admin");

  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  // Format createdAt to "hh:mm MM/DD/YYYY"
  const formattedUsers = users.map((user) => ({
    ...user,
    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    createdAt: user.createdAt.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour12: false,
    }),
  }));

  return formattedUsers;
}

// Update user role in admin panel
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

// Delete user in admin panel
export async function deleteUser(adminSession: Session, userId: string) {
  try {
    requireRole(adminSession, "admin"); // Restrict to admins only

    await db.user.delete({ where: { id: userId } });

    return { success: true };
  } catch (error) {
    return { error: error };
  }
}
