import { test, expect } from "./fixtures";

test.use({
  email: process.env.TEST_EMAIL!,
  password: process.env.TEST_PASSWORD!,
});

test.describe("Authenticated User Flows", () => {
  // Use email/password from environment variables

  test("homepage shows authenticated state", async ({ page }) => {
    await page.goto("/");

    // Should see welcome message for authenticated user
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Should see account navigation
    await expect(
      page.getByRole("link", { name: /view account/i })
    ).toBeVisible();

    // Should see sign out button
    // There are multiple sign out buttons, so we need to make sure we see at least one
    await expect(
      page.getByRole("button", { name: /sign out/i }).first()
    ).toBeVisible();

    // Should NOT see sign in button
    await expect(
      page.getByRole("link", { name: /sign in/i })
    ).not.toBeVisible();
  });

  test("can navigate to account page", async ({ page, email }) => {
    await page.goto("/");

    // Click on "View account" link
    await page.getByRole("link", { name: /view account/i }).click();

    // Should navigate to account page
    await expect(page).toHaveURL("/account");

    // Should see account details heading
    await expect(
      page.getByRole("heading", { name: /account details/i })
    ).toBeVisible();

    // Should see some user information fields
    await expect(page.getByText("Email")).toBeVisible();

    // should see the email address
    await expect(page.getByLabel("Email")).toHaveValue(email!);

    // Should see user ID field
    await expect(page.getByText("Id", { exact: true })).toBeVisible();
  });

  test("account page is protected - direct access works when authenticated", async ({
    page,
  }) => {
    // Direct navigation to protected route should work when authenticated
    await page.goto("/account");

    // Should see account details page
    await expect(
      page.getByRole("heading", { name: /account details/i })
    ).toBeVisible();

    // Should see user information
    await expect(page.getByText("Email")).toBeVisible();
  });

  test("can sign out successfully", async ({ page }) => {
    await page.goto("/");

    // Verify we start authenticated
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Click sign out button
    await page
      .getByRole("button", { name: /sign out/i })
      .first()
      .click();

    // Wait for sign out to complete and page to update
    await page.waitForLoadState("networkidle");

    // Should see unauthenticated state
    await expect(
      page.getByRole("heading", { name: /authkit authentication example/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /sign in with authkit/i })
    ).toBeVisible();
    await expect(
      page.getByText(/sign in to view your account details/i)
    ).toBeVisible();

    // Should NOT see authenticated elements
    await expect(page.getByText(/welcome back/i)).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: /sign out/i })
    ).not.toBeVisible();
  });

  test("navigation between pages works correctly", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Go to account
    await page.getByRole("link", { name: /view account/i }).click();
    await expect(page).toHaveURL("/account");
    await expect(
      page.getByRole("heading", { name: /account details/i })
    ).toBeVisible();

    // Go back to home via browser navigation
    await page.goBack();
    await expect(page).toHaveURL("/");
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Go forward again
    await page.goForward();
    await expect(page).toHaveURL("/account");
    await expect(
      page.getByRole("heading", { name: /account details/i })
    ).toBeVisible();
  });
});
