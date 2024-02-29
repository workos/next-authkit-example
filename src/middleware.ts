import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./auth";
import WorkOS from "@workos-inc/node";
import { sealData } from "iron-session";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Match against the account page
export const config = { matcher: ["/", "/account/:path*"] };
