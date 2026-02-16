import { test, expect } from "./fixtures";

// No test.use({ email: "...", password: "..." }) = unauthenticated by default

test.describe("Unauthenticated User Flows", () => {
  test("homepage shows unauthenticated state", async ({ page }) => {
    await page.goto("/");

    // Should see the unauthenticated homepage
    await expect(
      page.getByRole("heading", { name: /authkit authentication example/i })
    ).toBeVisible();
    await expect(
      page.getByText(/sign in to view your account details/i)
    ).toBeVisible();

    // Should see sign in button
    await expect(
      page.getByRole("link", { name: /sign in with authkit/i })
    ).toBeVisible();

    // Should NOT see authenticated elements
    await expect(page.getByText(/welcome back/i)).not.toBeVisible();
    await expect(
      page.getByRole("link", { name: /view account/i })
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign out/i })
    ).not.toBeVisible();
  });

  test("account page redirects unauthenticated users to login", async ({
    page,
  }) => {
    // Try to access protected route directly
    await page.goto("/account");

    // Should be redirected to WorkOS login (the URL will change away from the app)
    await page.waitForLoadState("networkidle");

    // The exact URL will depend on your WorkOS configuration, but it should not be /account
    expect(page.url()).not.toContain("/account");

    // Should see some kind of login form or AuthKit interface
    // The exact elements will depend on your WorkOS AuthKit configuration
    await expect(
      page.getByLabel(/email/i).or(page.getByRole("textbox").first())
    ).toBeVisible();
  });

  test("sign in button navigates to WorkOS login", async ({ page }) => {
    await page.goto("/");

    // Click the sign in button
    await page.getByRole("link", { name: /sign in with authkit/i }).click();

    // Should navigate to WorkOS AuthKit login
    await page.waitForLoadState("networkidle");

    // Should see login form
    await expect(
      page.getByLabel(/email/i).or(page.getByRole("textbox").first())
    ).toBeVisible();

    // URL should not be the original app URL
    const baseURL = process.env.TEST_BASE_URL;
    expect(page.url()).not.toBe(baseURL + "/");
    expect(page.url()).not.toContain(new URL(baseURL!).host);
  });
});
