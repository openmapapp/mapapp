"use client";

import { useSearchParams } from "next/navigation";
import SignUpForm from "@/app/components/auth/SignUpForm";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("invite") || "";

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <SignUpForm inviteCode={inviteCode} />
    </div>
  );
}
