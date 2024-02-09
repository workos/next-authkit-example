import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getJwtSecretKey, workos, getClientId } from "../../auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      // Use the code returned to us by AuthKit and authenticate the user with WorkOS
      const { user } = await workos.userManagement.authenticateWithCode({
        clientId: getClientId(),
        code,
      });

      // Create a JWT token with the user's information
      const token = await new SignJWT({
        // Here you might lookup and retrieve user details from your database
        user,
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(getJwtSecretKey());

      const url = request.nextUrl.clone();

      // Cleanup params
      url.searchParams.delete("code");

      // Redirect to the requested path and store the session
      url.pathname = "/";
      const response = NextResponse.redirect(url);

      response.cookies.set({
        name: "token",
        value: token,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      return response;
    } catch (error) {
      const errorRes = {
        error: error instanceof Error ? error.message : String(error),
      };
      console.error(errorRes);
      return NextResponse.json(errorRes);
    }
  }

  return NextResponse.redirect(new URL("/callback/error", request.url));
}
