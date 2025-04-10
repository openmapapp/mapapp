"use server";

import db from "@/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reportTypeSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  fields: z.string(), // JSON string of field configurations (kept for backward compatibility)
  iconUrl: z.string().optional(),
});

// Get all report types with their fields
export async function getReportTypes() {
  try {
    // Fetch report types
    const reportTypes = await db.reportType.findMany({
      orderBy: { name: "asc" },
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

    // Convert to format expected by the front-end
    const formattedReportTypes = reportTypes.map((reportType) => {
      // Convert ReportTypeFields to the legacy fields format
      const fieldsArray = reportType.reportTypeFields.map((field) => ({
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
        id: reportType.id,
        name: reportType.name,
        description: reportType.description || "",
        fields: JSON.stringify(fieldsArray),
        iconUrl: reportType.iconUrl || "",
      };
    });

    return {
      success: true,
      data: formattedReportTypes,
    };
  } catch (error: any) {
    console.error("Error fetching report types:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch report types",
    };
  }
}

// Save (create or update) a report type
export async function saveReportType(data: any) {
  try {
    const validated = reportTypeSchema.parse(data);

    // Parse fields from the JSON string
    let fields = [];
    try {
      fields = JSON.parse(validated.fields);
    } catch (e) {
      fields = [];
      console.error("Error parsing fields:", e);
    }

    // Start a transaction to ensure all operations succeed or fail together
    return await db.$transaction(async (tx) => {
      // 1. Update or create the report type
      let reportType;

      if (validated.id) {
        // Update existing
        reportType = await tx.reportType.update({
          where: { id: validated.id },
          data: {
            name: validated.name,
            description: validated.description || "",
            iconUrl: validated.iconUrl || null,
            // We'll handle fields separately
          },
        });

        // Delete existing report type fields (we'll recreate them)
        await tx.reportTypeField.deleteMany({
          where: { reportTypeId: reportType.id },
        });
      } else {
        // Create new
        reportType = await tx.reportType.create({
          data: {
            name: validated.name,
            description: validated.description || "",
            iconUrl: validated.iconUrl || null,
            // We'll handle fields separately
          },
        });
      }

      // 2. Process each field
      for (const field of fields) {
        // If field is filterable, find or create the FilterableField
        let filterableFieldId = null;

        if (field.filterable && field.filterable_id) {
          // Try to find existing filterable field
          const existingFilterableField = await tx.filterableField.findUnique({
            where: { fieldId: field.filterable_id },
          });

          if (existingFilterableField) {
            filterableFieldId = existingFilterableField.id;
          } else {
            // Create new filterable field
            const newFilterableField = await tx.filterableField.create({
              data: {
                fieldId: field.filterable_id,
                label: field.label || field.name,
                description: `Created for "${validated.name}" report type`,
              },
            });
            filterableFieldId = newFilterableField.id;
          }
        }

        // Create the ReportTypeField
        await tx.reportTypeField.create({
          data: {
            reportTypeId: reportType.id,
            filterableFieldId: filterableFieldId,
            name: field.name,
            label: field.label || field.name,
            type: field.type || "text",
            options: field.options ? JSON.stringify(field.options) : null,
            required: !!field.required,
            order: field.order || 0,
          },
        });
      }

      revalidatePath("/admin/settings");
      revalidatePath("/");

      // Return the report type with updated fields
      return {
        success: true,
        data: {
          ...reportType,
          fields: validated.fields, // Return the original fields JSON for simplicity
        },
      };
    });
  } catch (error: any) {
    console.error("Error saving report type:", error);
    return {
      success: false,
      error: error.message || "Failed to save report type",
    };
  }
}

// Delete a report type
export async function deleteReportType(id: number) {
  try {
    // Check if there are reports using this type
    const reportsCount = await db.report.count({
      where: { reportTypeId: id },
    });

    if (reportsCount > 0) {
      return {
        success: false,
        message: `Cannot delete this report type because it is used by ${reportsCount} reports`,
      };
    }

    // Delete the report type - all ReportTypeFields will be cascade deleted
    await db.reportType.delete({
      where: { id },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting report type:", error);
    return {
      success: false,
      message: error.message || "Failed to delete report type",
    };
  }
}
