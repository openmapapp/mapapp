"use server";

import db from "@/db";

// Fetch Global Settings
export async function getGlobalSettings() {
  const settings = await db.globalSettings.findFirst();
  return settings;
}
