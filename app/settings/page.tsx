"use client";

import { useSession, authClient } from "@/app/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // User details from session
  const [username, setUsername] = useState(session?.user?.username || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle Username Update
  const handleUpdateUsername = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        setSuccess("Username updated successfully!");
        await refresh(); // Refresh session to update UI
      } else {
        setError("Failed to update username.");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  // ✅ Handle Email Update
  const handleUpdateEmail = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess("Email updated successfully!");
        await refresh();
      } else {
        setError("Failed to update email.");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  // ✅ Handle Password Update
  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setSuccess("Password updated successfully!");
      } else {
        setError("Failed to update password.");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  // ✅ Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    try {
      const res = await fetch("/api/delete-account", { method: "DELETE" });

      if (res.ok) {
        await authClient.signOut();
        router.push("/");
      } else {
        setError("Failed to delete account.");
      }
    } catch (err) {
      setError("An error occurred.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-800 text-white mt-10 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Username Update */}
      <div className="mb-4">
        <label className="block">Username:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 px-4 py-2 rounded"
          onClick={handleUpdateUsername}
        >
          Update Username
        </button>
      </div>

      {/* Email Update */}
      <div className="mb-4">
        <label className="block">Email:</label>
        <input
          type="email"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 px-4 py-2 rounded"
          onClick={handleUpdateEmail}
        >
          Update Email
        </button>
      </div>

      {/* Password Update */}
      <div className="mb-4">
        <label className="block">New Password:</label>
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 px-4 py-2 rounded"
          onClick={handleUpdatePassword}
        >
          Update Password
        </button>
      </div>

      {/* Delete Account */}
      <div className="mt-6">
        <button
          className="bg-red-600 px-4 py-2 rounded"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
