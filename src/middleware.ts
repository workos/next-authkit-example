import { NextRequest, NextResponse } from "next/server";
import {
  getAuthorizationUrl,
  getSession,
  verifyAccessToken,
  verifyJwtToken,
} from "./auth";
import WorkOS from "@workos-inc/node";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { accessToken: token } = session;

  const hasVerifiedToken = token && (await verifyAccessToken(token));

  // Redirect unauthenticated users to the AuthKit flow
  if (!hasVerifiedToken) {
    try {
      const workos = new WorkOS(process.env.WORKOS_API_KEY);
      const { accessToken, refreshToken } =
        workos.userManagement.authenticateWithRefreshToken(refreshToken);
      session.accessToken = accessToken;
      session.refreshToken = refreshToken;
      await session.save();
    } catch {
      const authorizationUrl = await getAuthorizationUrl();
      const response = NextResponse.redirect(authorizationUrl);
      session.destroy();
      return response;
    }
  }

  return NextResponse.next();
}

// Match against the account page
export const config = { matcher: ["/account/:path*"] };
