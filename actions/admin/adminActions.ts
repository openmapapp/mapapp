"use server";

import db from "@/db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";

// Update Global Settings
export async function updateGlobalSettings(
  session: Session,
  updatedSettings: any
) {
  await requireRole(session, "admin");

  const { id, ...settingWithoutId } = updatedSettings;

  return await db.globalSettings.update({
    where: { id: 1 },
    data: settingWithoutId,
  });
}

// Fetch all users for admin panel user table
export async function fetchUsers(session: Session) {
  await requireRole(session, "admin");

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

// Delete user in admin panel
export async function deleteUser(adminSession: Session, userId: string) {
  try {
    await requireRole(adminSession, "admin"); // Restrict to admins only

    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return { error: "User not found" };
    }

    // Check if the user is trying to remove the last admin
    const numberOfAdmins = await db.user.count({
      where: { role: "admin" },
    });

    if (userId === adminSession.user.id) {
      return {
        error: "Cannot delete yourself. Please contact another admin.",
      };
    }

    const userToDelete = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (userToDelete?.role == "admin" && numberOfAdmins <= 1) {
      return {
        error: "Cannot remove the last admin. At least one admin is required.",
      };
    }

    await db.user.delete({ where: { id: userId } });

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: error };
  }
}
