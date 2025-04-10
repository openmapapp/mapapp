// migration-script.ts
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrateReportTypeFields() {
  // Get all report types
  const reportTypes = await prisma.reportType.findMany();

  // Track created filterable fields to avoid duplicates
  const createdFilterableFields = new Map();

  for (const reportType of reportTypes) {
    try {
      const fields = JSON.parse(reportType.fields || "[]");

      if (!Array.isArray(fields)) continue;

      for (const field of fields) {
        if (!field.name) continue;

        // Check if this is a filterable field
        if (field.filterable && field.filterable_id) {
          // Look up or create the FilterableField
          let filterableField = await prisma.filterableField.findUnique({
            where: { fieldId: field.filterable_id },
          });

          if (
            !filterableField &&
            !createdFilterableFields.has(field.filterable_id)
          ) {
            filterableField = await prisma.filterableField.create({
              data: {
                fieldId: field.filterable_id,
                label: field.label || field.name,
                description: `Auto-migrated from ${reportType.name}`,
              },
            });

            createdFilterableFields.set(
              field.filterable_id,
              filterableField.id
            );
          }

          const filterableFieldId =
            filterableField?.id ||
            createdFilterableFields.get(field.filterable_id);

          // Create the ReportTypeField with filterableField relation
          await prisma.reportTypeField.create({
            data: {
              reportTypeId: reportType.id,
              filterableFieldId,
              name: field.name,
              label: field.label || field.name,
              type: field.type || "text",
              options: field.options ? JSON.stringify(field.options) : null,
              required: !!field.required,
              order: field.order || 0,
            },
          });
        } else {
          // Create a regular ReportTypeField without a filterableField relation
          await prisma.reportTypeField.create({
            data: {
              reportTypeId: reportType.id,
              name: field.name,
              label: field.label || field.name,
              type: field.type || "text",
              options: field.options ? JSON.stringify(field.options) : null,
              required: !!field.required,
              order: field.order || 0,
            },
          });
        }
      }
    } catch (e) {
      console.error(
        `Error migrating fields for report type ${reportType.id}:`,
        e
      );
    }
  }

  console.log("Migration completed!");
}

migrateReportTypeFields()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
