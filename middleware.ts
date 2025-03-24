//Use this file to define which routes should be protected by authentication.
//You can make the entire site protected by adding the root of the project ("/") to the matcher below.

import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "./app/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const res = await fetch(`${request.nextUrl.origin}/api/global-settings`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-store",
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch global settings");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let globalSettings;
  try {
    globalSettings = await res.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  //Protect site based on settings
  if (globalSettings.mapOpenToVisitors === false && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    request.nextUrl.pathname === "/signup" &&
    globalSettings.registrationMode === "invite-only"
  ) {
    const inviteCode = request.nextUrl.searchParams.get("invite");
    if (!inviteCode) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  //Role-based access control
  const isAdmin = session?.user?.role === "admin";
  const isModerator = session?.user?.role === "moderator";

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/moderator") && !(isAdmin || isModerator)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

//The matcher array below will protect the dashboard and test routes.
export const config = {
  matcher: ["/", "/admin/:path*", "/moderator/:path*"],
};
