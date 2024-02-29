import { NextRequest, NextResponse } from "next/server";
import {
  encryptSession,
  cookieName,
  cookieOptions,
  authenticateWithCode,
} from "../../auth";
import type { User } from "@workos-inc/node";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      // Use the code returned to us by AuthKit and authenticate the user with WorkOS
      const { user, organizationId, accessToken, refreshToken } =
        await authenticateWithCode(code);

      const url = request.nextUrl.clone();

      // Cleanup params
      url.searchParams.delete("code");

      // Redirect to the requested path and store the session
      url.pathname = "/";
      const response = NextResponse.redirect(url);

      if (!accessToken || !refreshToken)
        throw new Error("response is missing tokens");

      cookies().set(
        cookieName,
        await encryptSession({ accessToken, refreshToken, user }),
        cookieOptions
      );

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
