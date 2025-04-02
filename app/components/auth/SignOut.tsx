"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

// Define props interface with optional className for styling flexibility
interface SignOutProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  showIcon?: boolean;
}

const SignOut = ({
  className = "",
  variant = "outline",
  showIcon = false,
}: SignOutProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Export the handleSignOut function as a property of the component
  const handleSignOut = async () => {
    if (loading) return; // Prevent multiple clicks

    setLoading(true);
    toast.loading("Signing out...");

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully signed out! Redirecting...");
            router.push("/sign-in");
          },
          onError: () => {
            toast.error("Failed to sign out. Please try again.");
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("An error occurred while signing out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      id="sign-out-button"
      variant={variant}
      onClick={handleSignOut}
      disabled={loading}
      className={`${className} ${showIcon ? "gap-2" : ""}`}
    >
      {showIcon && <LogOut size={16} />}
      Sign Out
    </Button>
  );
};

// Export the handleSignOut function for external use
export { SignOut as default };
