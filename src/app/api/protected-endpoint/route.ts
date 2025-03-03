import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";

// Add an artificial delay to simulate network latency
// This helps reproduce the race condition more reliably
const artificialDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const GET = async (request: NextRequest) => {
  // Extract request ID from query parameter
  const requestId = request.nextUrl.searchParams.get("id") || "unknown";

  try {
    // Add a random delay between 100-500ms to simulate network conditions
    const delay = Math.floor(Math.random() * 400) + 100;
    await artificialDelay(delay);

    // Use authkit to verify the user is authenticated
    const { session } = await authkit(request);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: `Request ${requestId}: Authentication failed` },
        { status: 401 },
      );
    }

    // Add another delay after authentication to increase the chance of race conditions
    await artificialDelay(Math.floor(Math.random() * 300) + 200);

    // Return success response
    return NextResponse.json({
      requestId,
      message: `Request ${requestId}: Authenticated successfully`,
      user: {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
      },
    });
  } catch (error) {
    console.error(`Request ${requestId} error:`, error);
    return NextResponse.json(
      {
        error: `Request ${requestId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
};
