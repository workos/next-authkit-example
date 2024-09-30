import { getSession } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

export const GET = async () => {
  // Use 'getSession' for edge functions that don't have access to headers
  const { user } = await getSession();

  return NextResponse.json({ name: user.firstName });
};
