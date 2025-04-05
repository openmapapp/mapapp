"use client";

import { useState, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useData } from "@/app/components/layout/DataProvider";
import { useSession } from "@/app/lib/auth-client";
import MapSettings from "@/app/components/admin/settings/MapSettings";
import AccessSettings from "@/app/components/admin/settings/AccessSettings";
import UserSettings from "@/app/components/admin/settings/UserSettings";
import {
  AdminSidebar,
  type AdminSectionId,
} from "@/app/components/admin/settings/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, MapPinned, Users, DoorOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define settings type for better type safety
interface GlobalSettings {
  id: number;
  mapCenterLat: number;
  mapCenterLng: number;
  mapBoundsSwLat?: number;
  mapBoundsSwLng?: number;
  mapBoundsNeLat?: number;
  mapBoundsNeLng?: number;
  mapZoom: number;
  mapZoomMin: number;
  mapZoomMax: number;
  mapApiKey?: string;
  mapOpenToVisitors: boolean;
  submitReportsOpen: boolean;
  votesOpenToVisitors?: boolean;
  registrationMode: "open" | "invite-only" | "closed";
  verifyPermission?: string;
  inviteCodes?: string;
  [key: string]: any; // Allow for additional properties
}

// Session type
interface Session {
  user: {
    id: string;
    role: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function AdminPanel() {
  const { data: session } = useSession() as { data: Session | null };
  const { globalSettings, updateSettings } = useData();
  const [newSettings, setNewSettings] = useState<GlobalSettings | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<AdminSectionId>("access");
  const [loading, setLoading] = useState<boolean>(true);

  // Section info for navigation
  const sections = [
    {
      id: "access" as AdminSectionId,
      label: "Access Settings",
      icon: DoorOpen,
    },
    { id: "map" as AdminSectionId, label: "Map Settings", icon: MapPinned },
    { id: "user" as AdminSectionId, label: "User Management", icon: Users },
  ];

  useEffect(() => {
    if (globalSettings) {
      setNewSettings(globalSettings as GlobalSettings);
      setLoading(false);
    }
  }, [globalSettings]);

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

  // Check for loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-76px)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Check for unauthorized access
  if (!session || session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-76px)]">
        <div className="max-w-md p-6 rounded-lg border border-destructive bg-destructive/10 text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">
            Unauthorized Access
          </h2>
          <p className="mb-4">You must be an admin to view this page.</p>
          <Button asChild>
            <Link href="/">Return to Map</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-[calc(100vh-76px)]">
        {/* Mobile navigation */}
        <div className="flex flex-col md:hidden p-4 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <Button asChild variant="outline" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <Home size={16} />
                <span className="sr-only md:not-sr-only">Map</span>
              </Link>
            </Button>
          </div>

          <Select
            value={activeSection}
            onValueChange={(value) => setActiveSection(value as AdminSectionId)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem
                  key={section.id}
                  value={section.id}
                  className="flex items-center gap-2"
                >
                  <section.icon className="h-4 w-4 inline mr-2" />
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator />
        </div>

        {/* Desktop sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Content area - works for both mobile and desktop */}
        <div className="p-4 md:p-6 md:ml-64">
          <main className="max-w-4xl mx-auto">
            {/* Desktop title (hidden on mobile) */}
            <div className="hidden md:flex md:items-center md:justify-between mb-4">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>

            <div className="mt-4 pb-12">
              {activeSection === "access" && newSettings && (
                <AccessSettings
                  newSettings={newSettings}
                  setNewSettings={setNewSettings}
                  globalSettings={globalSettings}
                  updating={updating}
                  handleSave={handleSave}
                />
              )}

              {activeSection === "map" && newSettings && (
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
      </div>
    </SidebarProvider>
  );
}
