"use client";

import { useState, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useData } from "@/app/components/layout/DataProvider";
import { useSession } from "@/app/lib/auth-client";
import MapSettings from "@/app/components/settings/MapSettings";
import AccessSettings from "@/app/components/settings/AccessSettings";
import UserSettings from "@/app/components/settings/UserSettings";
import { AdminSidebar } from "@/app/components/settings/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminPanel() {
  const { data: session } = useSession();
  const { globalSettings, updateSettings } = useData();
  const [newSettings, setNewSettings] = useState(globalSettings);
  const [updating, setUpdating] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [activeSection, setActiveSection] = useState("access");

  useEffect(() => {
    if (globalSettings) {
      setNewSettings(globalSettings);
    }
  }, [globalSettings]);

  if (!globalSettings) return <p>Loading settings...</p>;

  const handleSave = async () => {
    if (!newSettings) {
      console.error("No settings to update!");
      return; // Prevent function execution if newSettings is null
    }

    setUpdating(true);

    try {
      await updateSettings(session, newSettings);
      toast.success("Settings updated!");
    } catch (error) {
      toast.error("Failed to update settings.");
    }
    setUpdating(false);
  };

  if (!session || session.user.role !== "admin") {
    return <p>Unauthorized</p>;
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="p-6 w-full">
        <main className="p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Separator />
          <div className="mt-4">
            {activeSection === "access" && (
              <AccessSettings
                newSettings={newSettings}
                setNewSettings={setNewSettings}
                globalSettings={globalSettings}
                updating={updating}
                handleSave={handleSave}
              />
            )}
            {activeSection === "map" && (
              <MapSettings
                globalSettings={globalSettings}
                newSettings={newSettings}
                setNewSettings={setNewSettings}
                handleSave={handleSave}
              />
            )}
            {activeSection === "user" && <UserSettings session={session} />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
