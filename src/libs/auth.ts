import WorkOS, { User } from "@workos-inc/node";
import { jwtVerify } from "jose";

export type WorkOSUser = User;

// Initialize the WorkOS client
export const workos = new WorkOS(process.env.WORKOS_API_KEY);

export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not set");
  }

  return new TextEncoder().encode(process.env.JWT_SECRET_KEY);
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}
