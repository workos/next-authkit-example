import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getJwtSecretKey, workos } from "@/libs/auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      // Use the code returned to us by AuthKit and authenticate the user with WorkOS
      const { user } = await workos.users.authenticateWithCode({
        clientId: process.env.WORKOS_CLIENT_ID || "",
        code,
      });

      // Create a JWT token with the user's information
      const token = await new SignJWT({
        // Here you might lookup and retrieve user details from a database
        user,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(getJwtSecretKey());

      const url = request.nextUrl.clone();

      // Cleanup params from redirect
      url.searchParams.delete("code");
      url.pathname = "/";

      // Redirect to home page and store the session cookie
      const response = NextResponse.redirect(url);

      response.cookies.set({
        name: "token",
        value: token,
        path: "/",
        httpOnly: true,
      });

      return response;
    } catch (error) {
      return NextResponse.json({ success: false });
    }
  }

  return NextResponse.json({ success: false });
}
