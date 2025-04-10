// components/admin/settings/ReportSettings.tsx
"use client";

import { useState } from "react";
import ReportTypeSettings from "./ReportTypeSettings";
import ReportFieldsSection from "./ReportFieldsSection";

interface ReportSettingsProps {
  session: any;
}

export default function ReportSettings({ session }: ReportSettingsProps) {
  // We can maintain shared state here if needed between the two sections
  const [refreshFieldsTrigger, setRefreshFieldsTrigger] = useState(0);

  // Function to trigger field list refresh when a new field is created
  const refreshFields = () => {
    setRefreshFieldsTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-bold">Report Settings</h2>
        <p className="text-muted-foreground">
          Configure report types and fields for your mapping application.
        </p>
      </div>

      {/* Report Types Section */}
      <ReportTypeSettings session={session} onFieldCreated={refreshFields} />

      {/* Report Fields Section */}
      <ReportFieldsSection
        refreshTrigger={refreshFieldsTrigger}
        session={session}
      />
    </div>
  );
}
