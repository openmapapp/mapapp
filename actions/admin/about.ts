"use server";

import { revalidatePath } from "next/cache";
import db from "@/db";
import { requireRole } from "@/app/lib/requireRole";
import type { Session } from "@/app/lib/auth-client";

export async function updateAboutPage(session: Session, content: string) {
  requireRole(session, "admin");

  await db.globalSettings.upsert({
    where: { id: 1 },
    update: { aboutContent: content },
    create: { aboutContent: content },
  });

  revalidatePath("/about");
}

export async function getAboutContent() {
  const settings = await db.globalSettings.findFirst();
  return settings?.aboutContent || "";
}
