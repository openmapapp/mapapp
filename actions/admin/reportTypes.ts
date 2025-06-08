"use server";

import db from "@/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reportTypeSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  fields: z.string(), // JSON string of field configurations
});

// Get all report types
export async function getReportTypes() {
  try {
    const reportTypes = await db.reportType.findMany({
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      data: reportTypes,
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

    if (validated.id) {
      // Update existing
      const updated = await db.reportType.update({
        where: { id: validated.id },
        data: {
          name: validated.name,
          description: validated.description || "",
          fields: validated.fields,
        },
      });

      revalidatePath("/admin/settings");
      revalidatePath("/");

      return {
        success: true,
        data: updated,
      };
    } else {
      // Create new
      const created = await db.reportType.create({
        data: {
          name: validated.name,
          description: validated.description || "",
          fields: validated.fields,
        },
      });

      revalidatePath("/admin/settings");
      revalidatePath("/");

      return {
        success: true,
        data: created,
      };
    }
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

    // Delete the report type
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
