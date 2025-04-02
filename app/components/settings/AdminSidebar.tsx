"use client";

import { MapPinned, Users, DoorOpen, Home } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define section types for better type safety
export type AdminSectionId = "access" | "map" | "user";

interface AdminSidebarItem {
  id: AdminSectionId;
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminSidebarProps {
  activeSection: AdminSectionId;
  setActiveSection: (section: AdminSectionId) => void;
}

// Admin sidebar items
const items: AdminSidebarItem[] = [
  {
    id: "access",
    title: "Access",
    url: "#",
    icon: DoorOpen,
  },
  {
    id: "map",
    title: "Map",
    url: "#",
    icon: MapPinned,
  },
  {
    id: "user",
    title: "Users",
    url: "#",
    icon: Users,
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  return (
    <Sidebar className="hidden md:flex h-[calc(100vh-76px)] border-r">
      <SidebarHeader className="text-xl font-semibold">
        Admin Settings
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <Button
                    onClick={() => setActiveSection(item.id)}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      activeSection === item.id
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        activeSection === item.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-8">
        <Button asChild variant="outline" className="w-full">
          <Link href="/" className="flex items-center gap-2 w-full">
            <Home className="h-4 w-4" />
            Return to Map
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
