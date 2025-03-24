"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { set } from "zod";

const SignOut = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          if (loading) {
            toast.loading("Signing out...");
          }
        },
        onSuccess: () => {
          toast.success("Successfully signed out! Redirecting...");
          router.push("/sign-in");
          setLoading(false);
        },
      },
    });
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOut;
