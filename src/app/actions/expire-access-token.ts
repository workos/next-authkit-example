"use server";

import { cookies } from "next/headers";
import { unsealData, sealData } from "iron-session";

// Replace with the actual cookie password from your .env file
const COOKIE_PASSWORD = process.env.WORKOS_COOKIE_PASSWORD || "";
const COOKIE_NAME = "wos-session";

export async function expireAccessTokenAction() {
  try {
    if (!COOKIE_PASSWORD) {
      return {
        success: false,
        message:
          "Cookie password not configured. Check your environment variables.",
      };
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

    if (!sessionCookie) {
      return {
        success: false,
        message: "No session cookie found. Please sign in first.",
      };
    }

    // Decrypt the existing session
    const session: any = await unsealData(sessionCookie.value, {
      password: COOKIE_PASSWORD,
    });

    if (!session || !session.accessToken) {
      return {
        success: false,
        message: "Invalid session format. Please sign in again.",
      };
    }

    console.log("Current session before modification:", {
      hasAccessToken: !!session.accessToken,
      hasRefreshToken: !!session.refreshToken,
      user: session.user ? session.user.email : null,
    });

    // Create a modified session with a deliberately invalid access token
    // but keep the refresh token valid
    const modifiedSession = {
      ...session,
      accessToken: "deliberately.invalid.token", // This will force a token refresh
    };

    // Re-encrypt and set the cookie
    const sealedData = await sealData(modifiedSession, {
      password: COOKIE_PASSWORD,
    });

    cookieStore.set(COOKIE_NAME, sealedData, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return {
      success: true,
      message:
        "Access token expired (but refresh token preserved). Try the concurrent requests now.",
    };
  } catch (error) {
    console.error("Error expiring access token:", error);
    return {
      success: false,
      message: `Failed to expire token: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
