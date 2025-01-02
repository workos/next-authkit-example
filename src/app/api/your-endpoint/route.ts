import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Your API logic here
    const data = { message: "Hello from API" };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
