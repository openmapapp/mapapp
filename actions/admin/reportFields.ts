"use server";

import db from "@/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema validation for report fields
const reportFieldSchema = z.object({
  id: z.number().optional(), // Optional for new fields
  name: z.string().min(2, "Field name must be at least 2 characters"),
  label: z.string().min(2, "Label must be at least 2 characters"),
  type: z.enum(["text", "number", "select"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  filterable: z.boolean().default(false),
  reportTypeIds: z.array(z.number()), // Array of report type IDs this field is used in
});

// Get all report fields
export async function getReportFields() {
  try {
    // Fetch all ReportTypeFields with their report types
    const reportTypeFields = await db.reportTypeField.findMany({
      include: {
        reportType: true,
        filterableField: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Group fields by name to consolidate them
    const fieldMap = new Map();

    reportTypeFields.forEach((field) => {
      const key = field.name;
      if (!fieldMap.has(key)) {
        fieldMap.set(key, {
          id: field.id,
          name: field.name,
          label: field.label,
          type: field.type,
          options: field.options ? JSON.parse(field.options) : [],
          required: field.required,
          filterable: !!field.filterableFieldId,
          reportTypes: [],
        });
      }

      // Add the report type to this field
      fieldMap.get(key).reportTypes.push({
        id: field.reportType.id,
        name: field.reportType.name,
      });
    });

    return {
      success: true,
      data: Array.from(fieldMap.values()),
    };
  } catch (error) {
    console.error("Error fetching report fields:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch report fields",
    };
  }
}

// Get report types available for field association
export async function getReportTypesForFieldAssociation() {
  try {
    const reportTypes = await db.reportType.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      data: reportTypes,
    };
  } catch (error) {
    console.error("Error fetching report types for association:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch report types",
    };
  }
}

// Create or update a report field
export async function createReportField(data) {
  try {
    const validated = reportFieldSchema.parse(data);

    // Start a transaction
    return await db.$transaction(async (tx) => {
      let filterableFieldId = null;

      // If the field should be filterable, create or find FilterableField
      if (validated.filterable) {
        // Check if FilterableField already exists with this name
        const existingFilterableField = await tx.filterableField.findUnique({
          where: { fieldId: validated.name },
        });

        if (existingFilterableField) {
          filterableFieldId = existingFilterableField.id;

          // Update the filterable field label if needed
          if (existingFilterableField.label !== validated.label) {
            await tx.filterableField.update({
              where: { id: existingFilterableField.id },
              data: { label: validated.label },
            });
          }
        } else {
          // Create new FilterableField
          const newFilterableField = await tx.filterableField.create({
            data: {
              fieldId: validated.name,
              label: validated.label,
              description: `Field for ${validated.label}`,
            },
          });
          filterableFieldId = newFilterableField.id;
        }
      }

      // Process each report type association
      for (const reportTypeId of validated.reportTypeIds) {
        // Check if this field already exists for this report type
        const existingField = await tx.reportTypeField.findFirst({
          where: {
            reportTypeId,
            name: validated.name,
          },
        });

        if (existingField) {
          // Update existing field
          await tx.reportTypeField.update({
            where: { id: existingField.id },
            data: {
              label: validated.label,
              type: validated.type,
              options: validated.options
                ? JSON.stringify(validated.options)
                : null,
              required: validated.required,
              filterableFieldId: filterableFieldId,
            },
          });
        } else {
          // Create new field for this report type
          await tx.reportTypeField.create({
            data: {
              reportTypeId,
              name: validated.name,
              label: validated.label,
              type: validated.type,
              options: validated.options
                ? JSON.stringify(validated.options)
                : null,
              required: validated.required,
              filterableFieldId: filterableFieldId,
              order: 0, // Default order
            },
          });
        }
      }

      // If this field is no longer filterable, remove the association
      if (!validated.filterable && filterableFieldId) {
        await tx.reportTypeField.updateMany({
          where: { name: validated.name },
          data: { filterableFieldId: null },
        });
      }

      revalidatePath("/admin/settings");

      return {
        success: true,
      };
    });
  } catch (error) {
    console.error("Error creating/updating report field:", error);
    return {
      success: false,
      message: error.message || "Failed to save report field",
    };
  }
}

// Delete a report field
export async function deleteReportField(name) {
  try {
    // Start a transaction
    return await db.$transaction(async (tx) => {
      // First check if any reports are using this field
      const reportTypes = await tx.reportTypeField.findMany({
        where: { name },
        select: { reportTypeId: true },
      });

      // Delete all ReportTypeField entries for this field name
      await tx.reportTypeField.deleteMany({
        where: { name },
      });

      // Check if there's a corresponding FilterableField and delete if no longer used
      const filterableField = await tx.filterableField.findUnique({
        where: { fieldId: name },
      });

      if (filterableField) {
        // Check if any other fields are using this FilterableField
        const usageCount = await tx.reportTypeField.count({
          where: { filterableFieldId: filterableField.id },
        });

        if (usageCount === 0) {
          // No other fields are using this FilterableField, so delete it
          await tx.filterableField.delete({
            where: { id: filterableField.id },
          });
        }
      }

      revalidatePath("/admin/settings");

      return {
        success: true,
      };
    });
  } catch (error) {
    console.error("Error deleting report field:", error);
    return {
      success: false,
      message: error.message || "Failed to delete report field",
    };
  }
}
