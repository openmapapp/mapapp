//Use this file to define which routes should be protected by authentication.
//You can make the entire site protected by adding the root of the project ("/") to the matcher below.

import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "./app/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
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

  //if there is no session, redirect to the sign-in page.
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

//The matcher array below will protect the dashboard and test routes.
export const config = {
  matcher: ["/dashboard", "/test", "/settings", "/api"],
};
