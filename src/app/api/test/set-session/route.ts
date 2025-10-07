import { NextRequest, NextResponse } from "next/server";
import { saveSession } from "@workos-inc/authkit-nextjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, accessToken, refreshToken } = body;

    if (!user || !accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Missing required fields: user, accessToken, refreshToken" },
        { status: 400 }
      );
    }

    await saveSession({ accessToken, refreshToken, user }, request);

    return NextResponse.json(
      {
        success: true,
        message: "Session saved successfully",
        user: { email: user.email, id: user.id },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to save session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
