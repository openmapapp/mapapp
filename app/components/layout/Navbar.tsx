"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import SignOut from "../auth/SignOut";
import ModeToggle from "../layout/ModeToggle";
import SignInModal from "../auth/SignInModal";
import SignUpModal from "../auth/SignUpModal";
import { Button } from "@/components/ui/button";
import SettingsModal from "../auth/SettingsModal";
import { useData } from "@/context/DataProvider";
import { Menu, X, Settings, User, LogOut, LogIn, UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

// Define type for session
interface UserSession {
  user: {
    id: string;
    username?: string;
    name?: string;
    email?: string;
    role: "user" | "moderator" | "admin";
  };
}

export default function Navbar() {
  const { data: session } = useSession() as { data: UserSession | null }; // Updates after login/logout
  const { globalSettings } = useData(); // Access global settings
  const username = session?.user?.username || session?.user?.name || "User";
  const [sheetOpen, setSheetOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";
  const isLoggedIn = !!session;
  const isMapOpen = globalSettings?.mapOpenToVisitors;

  const renderDesktopAuthButtons = () => {
    if (!isLoggedIn) {
      if (isMapOpen) {
        // Map is open to visitors - show modals
        return (
          <div className="hidden sm:flex gap-4">
            <SignInModal />
            <SignUpModal />
          </div>
        );
      } else {
        // Map is NOT open to visitors - show links
        return (
          <div className="hidden sm:flex gap-4">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        );
      }
    }

    // User is logged in
    return (
      <div className="hidden sm:flex items-center gap-2">
        <p className="hidden sm:block">Welcome {username}</p>
        <SettingsModal />
        {isAdmin && (
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/admin">Admin</Link>
          </Button>
        )}
        <SignOut />
      </div>
    );
  };

  // Mobile menu content
  const renderMobileMenuContent = () => {
    return (
      <div className="flex flex-col gap-4 py-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-2 px-4 py-2">
              <User size={18} />
              <p>Welcome {username}</p>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/" className="flex items-center gap-2">
                  Home
                </Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  document.getElementById("settings-modal-trigger")?.click();
                  setSheetOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Settings size={18} />
                  User Settings
                </div>
              </Button>
            </SheetClose>
            {isAdmin && (
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2"
                  >
                    <Settings size={18} />
                    Admin Settings
                  </Link>
                </Button>
              </SheetClose>
            )}
            <Button
              variant="ghost"
              className="justify-start text-destructive"
              onClick={() => {
                document.getElementById("sign-out-button")?.click();
                setSheetOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <LogOut size={18} />
                Sign Out
              </div>
            </Button>
          </>
        ) : isMapOpen ? (
          <>
            <SheetClose asChild>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/" className="flex items-center gap-2">
                  Home
                </Link>
              </Button>
            </SheetClose>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                document.getElementById("sign-in-modal-trigger")?.click();
                setSheetOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <LogIn size={18} />
                Sign In
              </div>
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                document.getElementById("sign-up-modal-trigger")?.click();
                setSheetOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <UserPlus size={18} />
                Sign Up
              </div>
            </Button>
          </>
        ) : (
          <>
            <SheetClose asChild>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/" className="flex items-center gap-2">
                  Home
                </Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/sign-in" className="flex items-center gap-2">
                  <LogIn size={18} />
                  Sign In
                </Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/sign-up" className="flex items-center gap-2">
                  <UserPlus size={18} />
                  Sign Up
                </Link>
              </Button>
            </SheetClose>
          </>
        )}
      </div>
    );
  };

  return (
    <nav className="w-full flex items-center justify-between gap-6 px-4 sm:px-8 py-4 sm:py-5 border-b">
      <div className="flex items-center">
        <Link href="/" className="font-semibold text-lg">
          MapApp
        </Link>
        {globalSettings?.aboutContent !== null && (
          <Link
            href="/about"
            className="ml-6 hidden sm:block text-sm text-muted-foreground hover:underline"
          >
            About
          </Link>
        )}
        {globalSettings?.blogEnabled && (
          /* Blog link - only show if blog is enabled */
          <Link
            href="/blog"
            className="ml-6 hidden sm:block text-sm text-muted-foreground hover:underline"
          >
            Blog
          </Link>
        )}
      </div>

      <div className="flex gap-2 sm:gap-6 items-center">
        <ModeToggle />

        {/* Desktop navigation */}
        {renderDesktopAuthButtons()}

        {/* Mobile navigation - visible on smaller than sm breakpoint */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex justify-between items-center py-2 px-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </div>
            {renderMobileMenuContent()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Hidden triggers for modals */}
      <div className="hidden">
        <div id="sign-out-button">
          <SignOut />
        </div>
        <div id="settings-modal-trigger">
          <SettingsModal />
        </div>
        <div id="sign-in-modal-trigger">
          <SignInModal />
        </div>
        <div id="sign-up-modal-trigger">
          <SignUpModal />
        </div>
      </div>
    </nav>
  );
}
