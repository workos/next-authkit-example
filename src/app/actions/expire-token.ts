"use server";

import { cookies } from "next/headers";

export async function expireTokenAction() {
  try {
    const cookieName = "wos-session"; // Default cookie name for WorkOS AuthKit
    const cookieStore = await cookies();

    // Check if the cookie exists
    const sessionCookie = cookieStore.get(cookieName);
    if (!sessionCookie) {
      return {
        success: false,
        message: "No session cookie found. Please sign in first.",
      };
    }

    // Delete the WorkOS session cookie
    cookieStore.delete(cookieName);

    return {
      success: true,
      message: "Session expired. Try the concurrent requests now.",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to expire token: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
