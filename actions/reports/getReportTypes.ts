"use server";

import db from "../../db";

export async function getReportTypes() {
  // Fetch the report types from the database.
  const types = await db.reportType.findMany();
  // Map the result to a simpler array of objects if needed.
  return types.map((type) => ({
    id: type.id,
    name: type.name,
    fields: type.fields,
  }));
}
