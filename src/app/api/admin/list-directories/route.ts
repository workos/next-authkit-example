import { NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";

if (!process.env.WORKOS_API_KEY || !process.env.WORKOS_CLIENT_ID) {
  throw new Error("Missing required environment variables");
}

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Missing organizationId" },
        { status: 400 }
      );
    }

    const { data } = await workos.directorySync.listDirectories({
      organizationId,
    });

    if (data.length > 0) {
      console.log("DSync is enabled");
      return NextResponse.json({ dsyncEnabled: true });
    }
    console.log("DSync is disabled");
    return NextResponse.json({ dsyncEnabled: false });
  } catch (error) {
    console.error("Portal generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate portal link" },
      { status: 500 }
    );
  }
}
