"use server";

import { WorkOSUser, verifyJwtToken, workos } from "@/libs/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUser(): Promise<{
  isAuthenticated: boolean;
  user?: WorkOSUser | null;
}> {
  const token = cookies().get("token")?.value;
  const verifiedToken = token && (await verifyJwtToken(token));

  if (verifiedToken) {
    return {
      isAuthenticated: true,
      user: verifiedToken.user as WorkOSUser | null,
    };
  }

  return { isAuthenticated: false };
}

export async function getAuthorizationUrl() {
  const authorizationUrl = workos.sso.getAuthorizationURL({
    provider: "authkit",
    clientID: process.env.WORKOS_CLIENT_ID || "",
    redirectURI: process.env.WORKOS_REDIRECT_URI || "",
  });

  return authorizationUrl;
}

export async function logOut() {
  cookies().delete("token");
  redirect("/");
}
