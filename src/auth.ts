import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WorkOS, { User } from "@workos-inc/node";
import { jwtVerify } from "jose";
import { getIronSession } from "iron-session";

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

export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not set");
  }

  return new Uint8Array(Buffer.from(secret, "base64"));
}

interface Session {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function getSession() {
  const cookiePassword = process.env.COOKIE_PASSWORD;
  if (!cookiePassword) {
    throw new Error("COOKIE_PASSWORD is not set");
  }

  return getIronSession<Session>(cookies(), {
    password: cookiePassword,
    cookieName: "wos-session",
    cookieOptions: {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  });
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyAccessToken(accessToken: string) {
  // this would really look something like:
  //
  //  const verified = workos.userManagement.verifyAccessToken(accessToken);
  //
  // The SDK function would be responsible for validating the
  // accessToken (maybe we'd have a helper to handle expired
  // tokens and refresh automatically?)
  //
  // Who is responsible for getting/caching the JWKS? does
  // the SDK do that?

  return true;
}

export async function getUser(): Promise<{
  isAuthenticated: boolean;
  user?: User | null;
}> {
  const session = await getSession();
  const verifiedToken = session.accessToken && (await verifyAccessToken(session.accessToken));

  if (verifiedToken) {
    return {
      isAuthenticated: true,
      user: session.user,
    };
  }

  return { isAuthenticated: false };
}

export async function signOut() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
