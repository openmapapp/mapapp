"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  FileText,
  LayoutDashboard,
  PenLine,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "@/context/DataProvider";
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
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { globalSettings } = useData();
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [open, setOpen] = useState(false);

  // Check if blog is enabled in settings
  useEffect(() => {
    if (globalSettings) {
      setBlogEnabled(!!globalSettings.blogEnabled);
    }
  }, [globalSettings]);

  // Determine active route
  const isActive = (path: string) => pathname === path;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Sidebar className="h-full border-r w-64">
      <SidebarHeader className="text-xl font-semibold">
        Admin Panel
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  variant={isActive("/admin") ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive("/admin")
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50"
                  )}
                  onClick={() => router.push("/admin")}
                >
                  <LayoutDashboard
                    className={cn(
                      "h-5 w-5",
                      isActive("/admin")
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <span>Dashboard</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  variant={isActive("/admin/settings") ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive("/admin/settings")
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50"
                  )}
                  onClick={() => router.push("/admin/settings")}
                >
                  <Settings
                    className={cn(
                      "h-5 w-5",
                      isActive("/admin/settings")
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <span>Settings</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  variant={isActive("/admin/about") ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive("/admin/about")
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50"
                  )}
                  onClick={() => router.push("/admin/about")}
                >
                  <FileText
                    className={cn(
                      "h-5 w-5",
                      isActive("/admin/about")
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <span>About Page</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Blog section (only shown if enabled in settings) */}
            {blogEnabled && (
              <>
                <Separator className="my-2" />

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between px-2 py-1 h-9"
                      onClick={handleToggle}
                    >
                      <div className="flex items-center gap-2">
                        <PenLine className="h-5 w-5 text-muted-foreground" />
                        <span>Blog</span>
                      </div>
                      {open ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pl-2">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Button
                          variant={
                            isActive("/admin/blog") ? "secondary" : "ghost"
                          }
                          className={cn(
                            "w-full justify-start gap-2 mt-1",
                            isActive("/admin/blog")
                              ? "bg-secondary text-secondary-foreground"
                              : "hover:bg-secondary/50"
                          )}
                          onClick={() => router.push("/admin/blog")}
                        >
                          <span>Overview</span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Button
                          variant={
                            isActive("/admin/blog/new") ? "secondary" : "ghost"
                          }
                          className={cn(
                            "w-full justify-start gap-2",
                            isActive("/admin/blog/new")
                              ? "bg-secondary text-secondary-foreground"
                              : "hover:bg-secondary/50"
                          )}
                          onClick={() => router.push("/admin/blog/new")}
                        >
                          <span>Add Blog Post</span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Button
                          variant={
                            isActive("/admin/blog/categories")
                              ? "secondary"
                              : "ghost"
                          }
                          className={cn(
                            "w-full justify-start gap-2",
                            isActive("/admin/blog/categories")
                              ? "bg-secondary text-secondary-foreground"
                              : "hover:bg-secondary/50"
                          )}
                          onClick={() => router.push("/admin/blog/categories")}
                        >
                          <span>Categories</span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
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
