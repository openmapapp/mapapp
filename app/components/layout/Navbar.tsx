"use client";

import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import SignOut from "../auth/SignOut";
import ModeToggle from "../layout/ModeToggle";
import SignInModal from "../auth/SignInModal";
import SignUpModal from "../auth/SignUpModal";
import { Button } from "@/components/ui/button";
import SettingsModal from "../auth/SettingsModal";
import { useData } from "@/app/components/layout/DataProvider";

export default function Navbar() {
  const { data: session } = useSession(); // ✅ Updates after login/logout
  const { globalSettings } = useData(); // ✅ Access global settings
  const username = session?.user?.username;

  return (
    <div className="w-full flex items-center justify-between gap-6 px-8 py-5">
      <Link href="/">HOME</Link>
      <div className="flex gap-6 items-center">
        <ModeToggle />

        {globalSettings?.mapOpenToVisitors ? (
          username ? (
            session.user.role === "admin" ? (
              <div className="flex gap-6 items-center">
                <p>Welcome {username}</p>
                <SettingsModal />
                <Button variant="outline" asChild>
                  <Link href="/admin/settings">Admin Settings</Link>
                </Button>
                <SignOut />
              </div>
            ) : (
              <div className="flex gap-6 items-center">
                <p>Welcome {username}</p>
                <SettingsModal />
                <SignOut />
              </div>
            )
          ) : (
            <div className="flex gap-4">
              <SignInModal />
              <SignUpModal />
            </div>
          )
        ) : username ? (
          <div className="flex gap-6 items-center">
            <p>Welcome {username}</p>
            <SettingsModal />
            <SignOut />
          </div>
        ) : (
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
