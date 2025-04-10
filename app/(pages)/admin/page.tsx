"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataProvider";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { globalSettings } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalSettings) {
      setLoading(false);
    }
  }, [globalSettings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Map Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Map is {globalSettings.mapOpenToVisitors ? "open" : "restricted"}{" "}
              to visitors
            </p>
            <p className="mt-2">Current map zoom: {globalSettings.mapZoom}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Registration mode: {globalSettings.registrationMode}</p>
            {globalSettings.registrationMode === "invite-only" && (
              <p className="mt-2">
                Active invite codes:{" "}
                {globalSettings.inviteCodes?.split(",").length || 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Blog: {globalSettings.blogEnabled ? "Enabled" : "Disabled"}</p>
            <p className="mt-2">
              Reports: {globalSettings.submitReportsOpen ? "Open" : "Closed"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
