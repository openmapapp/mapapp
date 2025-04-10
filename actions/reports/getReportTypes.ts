// actions/reports/getReportTypes.ts
"use server";

import db from "../../db";

export async function getReportTypes() {
  // Fetch the report types from the database with their fields
  const types = await db.reportType.findMany({
    include: {
      reportTypeFields: {
        include: {
          filterableField: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  // Convert to the expected format
  return types.map((type) => {
    // Convert ReportTypeFields to the legacy fields format
    const fieldsArray = type.reportTypeFields.map((field) => ({
      id: field.id.toString(),
      name: field.name,
      label: field.label,
      type: field.type,
      options: field.options ? JSON.parse(field.options) : undefined,
      required: field.required,
      filterable: !!field.filterableFieldId,
      filterable_id: field.filterableField?.fieldId || "",
      order: field.order,
    }));

    return {
      id: type.id,
      name: type.name,
      description: type.description || "",
      fields: JSON.stringify(fieldsArray), // Convert to string as expected by client
      iconUrl: type.iconUrl || null,
    };
  });
}
