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
    // Create significant and varied delays to simulate different network conditions
    // This increases the chance of concurrent token refresh attempts
    const initialDelay =
      Math.floor(Math.random() * 200) + parseInt(requestId as string) * 100;
    console.log(
      `Request ${requestId} starting with initial delay of ${initialDelay}ms`,
    );
    await artificialDelay(initialDelay);

    // Use authkit to verify the user is authenticated
    const { session } = await authkit(request, {
      debug: true, // Enable debug for this request
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: `Request ${requestId}: Authentication failed` },
        { status: 401 },
      );
    }

    // Add another substantial delay after authentication
    // This gives other concurrent requests time to attempt token refresh
    const secondDelay = Math.floor(Math.random() * 500) + 300;
    console.log(
      `Request ${requestId} continuing with second delay of ${secondDelay}ms`,
    );
    await artificialDelay(secondDelay);

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

    // Special handling for refresh token errors to make them easier to detect
    let errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorObj = error as any;

    if (
      errorObj &&
      errorObj.error === "invalid_grant" &&
      errorObj.errorDescription &&
      errorObj.errorDescription.includes("Refresh token already exchanged")
    ) {
      console.warn(
        `Request ${requestId} HIT THE RACE CONDITION: Refresh token already exchanged`,
      );

      return NextResponse.json(
        {
          error: `Request ${requestId}: Refresh token already exchanged.`,
          details: errorObj,
        },
        { status: 401 },
      );
    }

    // Check if the error object has nested information (common in OAuth errors)
    if (errorObj && errorObj.rawData) {
      errorMessage = `${errorMessage}. Details: ${JSON.stringify(errorObj.rawData)}`;
    }

    return NextResponse.json(
      {
        error: `Request ${requestId}: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
};
