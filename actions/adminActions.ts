"use server";

import db from "@/db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";

// Update Global Settings (Admins only)
export async function updateGlobalSettings(session: Session, updatedSettings) {
  requireRole(session, "admin");

  const { id, ...settingWithoutId } = updatedSettings;

  return await db.globalSettings.update({
    where: { id: 1 },
    data: settingWithoutId,
  });
}

export async function fetchUsers(session: Session) {
  requireRole(session, "admin");

  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
    },
  });

  return users;
}
