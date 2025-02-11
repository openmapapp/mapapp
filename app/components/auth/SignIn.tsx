"use client";
import { authClient } from "@/app/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("email");
  const [password, setPassword] = useState("password");
  const router = useRouter();

  const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.email(
      { email, password, callbackURL: "/", rememberMe: false },
      {
        onRequest: (ctx) => {
          console.log("onRequest", ctx);
        },
        onSuccess: (ctx) => {
          console.log("onSuccess", ctx);
        },
        onError: (ctx) => {
          console.log("onError", ctx);
        },
      }
    );
  };

  return (
    <div className="bg-white-700 mx-auto my-5 w-[50%] h-screen p-8 flex flex-col items-center justify-center gap-6">
      <input
        type="email"
        className="border-2 border-gray-400 text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border-2 border-gray-400 text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
