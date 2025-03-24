"use server";

import db from "@/db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";

export async function generateInvite(session: Session) {
  requireRole(session, "admin");

  const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  try {
    await db.inviteCode.create({
      data: {
        code: inviteCode,
      },
    });
  } catch (error) {
    return error;
  }

  return `https://localhost:3000/log-in?invite=${inviteCode}`;
}
