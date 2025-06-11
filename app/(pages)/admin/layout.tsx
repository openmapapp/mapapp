// app/admin/layout.tsx
"use client";

import { useState } from "react";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { useSession } from "@/app/lib/auth-client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  // Simulate initial loading if needed
  setTimeout(() => setLoading(false), 300);

  // Check for unauthorized access
  if (!session || session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-76px)] w-full">
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-81px)] w-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-[calc(100vh-76px)] w-full overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-auto p-10">{children}</div>
      </div>
    </SidebarProvider>
  );
}
