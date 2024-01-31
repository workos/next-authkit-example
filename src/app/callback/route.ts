import { NextRequest, NextResponse } from "next/server";
import { getJwtSecretKey, workos, getClientId, getSession } from "../../auth";
import type { User } from "@workos-inc/node";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      // Use the code returned to us by AuthKit and authenticate the user with WorkOS
      const { user, organizationId, accessToken, refreshToken } =
        await workos.userManagement.authenticateWithCode({
          clientId: getClientId(),
          code,
        });

      const url = request.nextUrl.clone();

      // Cleanup params
      url.searchParams.delete("code");

      // Redirect to the requested path and store the session
      url.pathname = "/";
      const response = NextResponse.redirect(url);

      const session = await getSession()
      session.accessToken = accessToken;
      session.refreshToken = refreshToken;
      session.user = user;
      await session.save();

      return response;
    } catch (error) {
      const errorRes = {
        error: error instanceof Error ? error.message : String(error),
      };
      console.error(errorRes);
      return NextResponse.redirect(new URL("/error", request.url));
    }
  }

  return NextResponse.redirect(new URL("/error", request.url));
}
