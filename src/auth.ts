import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import WorkOS, { User } from "@workos-inc/node";
import { jwtVerify } from "jose";
import { getIronSession, sealData, unsealData } from "iron-session";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { JWTExpired } from "jose/errors";

const JWKS = jose.createRemoteJWKSet(
  new URL("http://localhost:7000/sso/jwks/project_01DZB0E7HQMA6G85PQNHQJMZD0")
);

// Initialize the WorkOS client
export const workos = new WorkOS(process.env.WORKOS_API_KEY);

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

interface Session {
  accessToken: string;
  refreshToken: string;
  user: User;
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

export const encryptSession = async (session: Session) =>
  sealData(session, { password: getCookiePassword() });

async function getSessionFromCookie() {
  const cookie = cookies().get("wos-session");
  if (cookie) {
    return unsealData<Session>(cookie.value, { password: getCookiePassword() });
  }
}

export async function verifyAccessToken(accessToken: string) {
  try {
    const { payload } = await jose.jwtVerify(accessToken, JWKS);
    return true;
  } catch (e) {
    console.warn("Failed to verify session:", e);
    return false;
  }
}

interface UserInfo {
  user: User;
  organizationId: string;
  sessionId: string;
}
interface NoUserInfo {
  user: null;
  sessionId?: undefined;
}
export async function getUser(): Promise<UserInfo | NoUserInfo> {
  const session = await getSessionFromHeader();
  if (!session) return { user: null };

  const { sid: sessionId, org_id: organizationId } =
    jose.decodeJwt<AccessToken>(session.accessToken);

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

interface AccessToken {
  sid: string;
  org_id: string;
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

export const cookieName = "wos-session";

export const cookieOptions = {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
};

export async function updateSession(request: NextRequest) {
  const session = await getSessionFromCookie();

  // no session case
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
    const { accessToken, refreshToken } = await refreshSession(
      session.refreshToken
    );
    console.log("Refresh successful:", refreshToken);
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
