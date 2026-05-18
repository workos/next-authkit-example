import { GET } from "./route";
import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

jest.mock("@workos-inc/authkit-nextjs", () => ({
  getSignInUrl: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("login route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to sign in url", async () => {
    const mockSignInUrl = "https://example.com/signin";
    (getSignInUrl as jest.Mock).mockResolvedValue(mockSignInUrl);

    await GET();

    expect(getSignInUrl).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(mockSignInUrl);
  });
});
