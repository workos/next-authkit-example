import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import WorkOS from "@workos-inc/node";
import { jwtVerify, createRemoteJWKSet, decodeJwt } from "jose";
import { sealData, unsealData } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { Session, UserInfo, NoUserInfo, AccessToken } from "./interfaces";

// Cookie parameters
export const cookieName = "wos-session";
export const cookieOptions = {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
};

// Initialize the WorkOS client
const workos = new WorkOS(process.env.WORKOS_API_KEY);

// const jwksUrl = workos.userManagement.getJwksUrl(process.env.WORKOS_CLIENT_ID);
const JWKS = createRemoteJWKSet(
  new URL(`https://api.workos.com/sso/jwks/${getClientId()}`)
);

async function getSessionFromCookie() {
  const cookie = cookies().get("wos-session");
  if (cookie) {
    return unsealData<Session>(cookie.value, { password: getCookiePassword() });
  }
}

function getCookiePassword() {
  const cookiePassword = process.env.COOKIE_PASSWORD;
  if (!cookiePassword) {
    throw new Error("COOKIE_PASSWORD is not set");
  }
  return cookiePassword;
}

async function getSessionFromHeader(): Promise<Session | undefined> {
  const authHeader = headers().get("x-workos-session");
  if (!authHeader) return;

  return unsealData<Session>(authHeader, { password: getCookiePassword() });
}

/** Exported functions */

export function getClientId() {
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!clientId) {
    throw new Error("WORKOS_CLIENT_ID is not set");
  }

  return clientId;
}

export async function getAuthorizationUrl() {
  const redirectUri = process.env.WORKOS_REDIRECT_URI;

  if (!redirectUri) {
    throw new Error("WORKOS_REDIRECT_URI is not set");
  }

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId: getClientId(),
    // The endpoint that WorkOS will redirect to after a user authenticates
    redirectUri,
  });

  return authorizationUrl;
}

export const encryptSession = async (session: Session) =>
  sealData(session, { password: getCookiePassword() });

export async function verifyAccessToken(accessToken: string) {
  try {
    const { payload } = await jwtVerify(accessToken, JWKS);
    return true;
  } catch (e) {
    console.warn("Failed to verify session:", e);
    return false;
  }
}

export async function getUser(): Promise<UserInfo | NoUserInfo> {
  const session = await getSessionFromHeader();
  if (!session) return { user: null };

  const { sid: sessionId, org_id: organizationId } = decodeJwt<AccessToken>(
    session.accessToken
  );

  return {
    user: session.user,
    sessionId,
    organizationId,
  };
}

export async function requireUser(): Promise<UserInfo> {
  const userInfo = await getUser();
  if (userInfo.user) {
    return userInfo;
  }

  redirect(await getAuthorizationUrl());
}

export async function authenticateWithCode(code: string) {
  return workos.userManagement.authenticateWithCode({
    clientId: getClientId(),
    code,
  });
}

export async function refreshSession(refreshToken: string) {
  console.log("Attempting to refresh session:", refreshToken);
  return workos.userManagement.authenticateWithRefreshToken({
    clientId: getClientId(),
    refreshToken,
  });
}

export async function signOut() {
  cookies().delete("wos-session");
  const { sessionId } = await getUser();

  if (sessionId) {
    redirect(workos.userManagement.getLogoutUrl({ sessionId }));
    return;
  }

  redirect("/");
}

export async function updateSession(request: NextRequest) {
  const session = await getSessionFromCookie();

  // If no session, just continue
  if (!session) {
    return NextResponse.next();
  }

  const hasValidSession = await verifyAccessToken(session.accessToken);

  const newRequestHeaders = new Headers(request.headers);

  if (hasValidSession) {
    console.log("Session is valid");
    // set the x-workos-session header according to the current cookie value
    newRequestHeaders.set(
      "x-workos-session",
      cookies().get("wos-session")!.value
    );
    return NextResponse.next({
      headers: newRequestHeaders,
    });
  }

  try {
    console.log("Session invalid. Attempting refresh");

    // If the session is invalid (i.e. the access token has expired) attempt to re-authenticate with the refresh token
    const { accessToken, refreshToken } = await refreshSession(
      session.refreshToken
    );

    console.log("Refresh successful:", refreshToken);

    // Encrypt session with new access and refresh tokens
    const encryptedSession = await encryptSession({
      accessToken,
      refreshToken,
      user: session.user,
    });

    newRequestHeaders.set("x-workos-session", encryptedSession);

    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });
    // update the cookie
    response.cookies.set(cookieName, encryptedSession, cookieOptions);
    return response;
  } catch (e) {
    console.warn("Failed to refresh", e);
    const response = NextResponse.next();
    response.cookies.delete("wos-session");
    return response;
  }
}
