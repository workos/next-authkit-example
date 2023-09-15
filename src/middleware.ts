import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/libs/auth";

export async function middleware(request: NextRequest) {
  const { url, cookies } = request;
  const { value: token } = cookies.get("token") ?? { value: null };

  const hasVerifiedToken = token && (await verifyJwtToken(token));

  if (!hasVerifiedToken) {
    // Alternatively you may wish to redirect to the AuthKit login page
    // const authorizationUrl = await getAuthorizationUrl();
    // const response = NextResponse.redirect(authorizationUrl);
    const response = NextResponse.redirect(new URL(`/unauthorized`, url));

    response.cookies.delete("token");

    return response;
  }

  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*"] };
