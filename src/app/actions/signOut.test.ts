// Mock the module before any imports
const mockSignOut = jest.fn().mockResolvedValue(undefined);

jest.mock("@workos-inc/authkit-nextjs", () => ({
  signOut: mockSignOut,
}));

import { handleSignOutAction } from "./signOut";
import { signOut } from "@workos-inc/authkit-nextjs";

describe("handleSignOutAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call signOut from authkit-nextjs", async () => {
    await handleSignOutAction();

    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it("should await the signOut call", async () => {
    await handleSignOutAction();

    expect(signOut).toHaveBeenCalled();
  });
});
