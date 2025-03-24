"use client";

import SignInForm from "../../components/auth/SignInForm";

export default function Page() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <SignInForm />
    </div>
  );
}
