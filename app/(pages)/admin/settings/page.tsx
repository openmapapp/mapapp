// app/admin/settings/page.tsx
"use client";

import { useState } from "react";
import { useData } from "@/context/DataProvider";
import { useSession } from "@/app/lib/auth-client";
import MapSettings from "@/app/components/admin/settings/MapSettings";
import AccessSettings from "@/app/components/admin/settings/AccessSettings";
import UserSettings from "@/app/components/admin/settings/UserSettings";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportTypeSettings from "@/app/components/admin/settings/ReportTypeSettings";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { globalSettings, updateSettings } = useData();
  const [newSettings, setNewSettings] = useState(globalSettings);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("access");

  // Handle settings updates
  const handleSave = async () => {
    if (!newSettings || !session) {
      toast.error("Missing settings or session data");
      return;
    }

    setUpdating(true);

    try {
      await updateSettings(session, newSettings);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (!globalSettings) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex p-0 bg-transparent border border-border rounded-md overflow-hidden">
          <TabsTrigger
            value="access"
            className="flex-1 py-2.5 px-4 rounded-none border-0 data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-secondary/50 hover:cursor-pointer transition-colors"
          >
            Access
          </TabsTrigger>

          <Separator orientation="vertical" className="h-6 my-auto" />

          <TabsTrigger
            value="map"
            className="flex-1 py-2.5 px-4 rounded-none border-0 data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-secondary/50 hover:cursor-pointer transition-colors"
          >
            Map
          </TabsTrigger>

          <Separator orientation="vertical" className="h-6 my-auto" />

          <TabsTrigger
            value="reports"
            className="flex-1 py-2.5 px-4 rounded-none border-0 data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-secondary/50 hover:cursor-pointer transition-colors"
          >
            Report Fields
          </TabsTrigger>

          <Separator orientation="vertical" className="h-6 my-auto" />

          <TabsTrigger
            value="users"
            className="flex-1 py-2.5 px-4 rounded-none border-0 data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-secondary/50 hover:cursor-pointer transition-colors"
          >
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access">
          {session && (
            <AccessSettings
              newSettings={newSettings}
              setNewSettings={setNewSettings}
              globalSettings={globalSettings}
              updating={updating}
              handleSave={handleSave}
            />
          )}
        </TabsContent>

        <TabsContent value="map">
          {session && (
            <MapSettings
              globalSettings={globalSettings}
              newSettings={newSettings}
              setNewSettings={setNewSettings}
              handleSave={handleSave}
            />
          )}
        </TabsContent>

        <TabsContent value="reports">
          {session && <ReportTypeSettings session={session} />}
        </TabsContent>

        <TabsContent value="users">
          {session && <UserSettings session={session} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
