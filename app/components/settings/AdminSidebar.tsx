import { MapPinned, Users, DoorOpen } from "lucide-react";

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

const items = [
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
    title: "User",
    url: "#",
    icon: Users,
  },
];

export const AdminSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <Sidebar>
      <SidebarHeader>Settings</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-2 mb-2 ${
                      activeSection === item.id ? "bg-gray-300" : ""
                    }`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
