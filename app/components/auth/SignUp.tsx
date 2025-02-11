"use client";
import { authClient } from "@/app/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("Email");
  const [password, setPassword] = useState("Password");
  const [name, setName] = useState("Name");
  const [username, setUsername] = useState("Username");
  //const [image, setImage] = useState<File | null>(null);

  const trust = 1;
  const router = useRouter();

  const signUp = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        username,
        trust,
        //image: image ? convertImageToBase64(image) : undefined,
      },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          router.push("/");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-[50%]">
      <input
        type="name"
        className="border-2 border-gray-400 text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="name"
        className="border-2 border-gray-400 text-black"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="border-2 border-gray-400 text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        className="border-2 border-gray-400 text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}
