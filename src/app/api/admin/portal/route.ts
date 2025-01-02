import { NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";

if (!process.env.WORKOS_API_KEY || !process.env.WORKOS_CLIENT_ID) {
  throw new Error("Missing required environment variables");
}

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

export async function POST(request: Request) {
  try {
    const { organization, intent } = await request.json();

    if (!organization || !intent) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const portal = await workos.portal.generateLink({
      organization,
      intent,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
    });

    return NextResponse.json({ url: portal.link });
  } catch (error) {
    console.error("Portal generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate portal link" },
      { status: 500 }
    );
  }
}
