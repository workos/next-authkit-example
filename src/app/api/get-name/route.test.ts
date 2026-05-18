import { GET } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { authkit } from "@workos-inc/authkit-nextjs";

jest.mock("@workos-inc/authkit-nextjs", () => ({
  authkit: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("GET /api/get-name", () => {
  const mockJson = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (NextResponse.json as jest.Mock) = mockJson;
  });

  it("should return user's first name when session exists", async () => {
    const mockSession = {
      user: { firstName: "John" },
    };
    (authkit as jest.Mock).mockResolvedValue({ session: mockSession });

    const request = {} as NextRequest;
    await GET(request);

    expect(mockJson).toHaveBeenCalledWith({ name: "John" });
  });

  it("should return 404 when session does not exist", async () => {
    (authkit as jest.Mock).mockResolvedValue({ session: null });

    const request = {} as NextRequest;
    await GET(request);

    expect(mockJson).toHaveBeenCalledWith({ error: "User not found" }, { status: 404 });
  });

  it("should return 404 when session exists but user is missing", async () => {
    (authkit as jest.Mock).mockResolvedValue({ session: {} });

    const request = {} as NextRequest;
    await GET(request);

    expect(mockJson).toHaveBeenCalledWith({ error: "User not found" }, { status: 404 });
  });
});
