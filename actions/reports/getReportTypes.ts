"use server";

import db from "../../db";

export async function getReportTypes() {
  // Fetch the report types from the database.
  const types = await db.reportType.findMany();

  // Return the complete report type data
  return types.map((type) => ({
    id: type.id,
    name: type.name,
    fields: type.fields,
    description: type.description,
    iconUrl: type.iconUrl || null, // Ensure we always return a value even if null
  }));
}
