-- CreateTable
CREATE TABLE "FilterableField" (
    "id" SERIAL NOT NULL,
    "fieldId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "FilterableField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTypeField" (
    "id" SERIAL NOT NULL,
    "reportTypeId" INTEGER NOT NULL,
    "filterableFieldId" INTEGER,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ReportTypeField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FilterableField_fieldId_key" ON "FilterableField"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportTypeField_reportTypeId_name_key" ON "ReportTypeField"("reportTypeId", "name");

-- AddForeignKey
ALTER TABLE "ReportTypeField" ADD CONSTRAINT "ReportTypeField_reportTypeId_fkey" FOREIGN KEY ("reportTypeId") REFERENCES "ReportType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTypeField" ADD CONSTRAINT "ReportTypeField_filterableFieldId_fkey" FOREIGN KEY ("filterableFieldId") REFERENCES "FilterableField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
