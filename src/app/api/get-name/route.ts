import { getSession } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

export const GET = async () => {
  // Use 'getSession' for edge functions that don't have access to headers
  const session = await getSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ name: session.user.firstName });
};
