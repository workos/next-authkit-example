# E2E Testing with Playwright and WorkOS AuthKit

End-to-end tests for WorkOS AuthKit authentication using programmatic authentication.

## Setup

**Environment Variables:**

```bash
# WorkOS Configuration
WORKOS_CLIENT_ID=your_client_id
WORKOS_API_KEY=your_api_key
WORKOS_COOKIE_PASSWORD=your_cookie_password
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Test Configuration (optional)
TEST_BASE_URL=http://localhost:3000
```

**Run Tests:**

```bash
npm run test:playwright
```

## Usage

**Import fixtures:**

```typescript
import { test, expect } from "./fixtures";
```

**Authenticated tests:**

```typescript
test.describe("Admin Features", () => {
  test.use({ email: "testuser@test.com", password: "password" });

  test("admin panel access", async ({ page }) => {
    await page.goto("/admin"); // Already authenticated
  });
});
```

**Unauthenticated tests:**

```typescript
test.describe("Public Features", () => {
  // No test.use() = unauthenticated

  test("login page", async ({ page }) => {
    await page.goto("/");
  });
});
```

## Authentication System

**Flow:**

1. API authentication via WorkOS SDK
2. Set the WorkOS session cookie in the browser

## Files

- `fixtures.ts` - Authentication fixture system
- `authenticated-flows.spec.ts` - Tests for authenticated users
- `unauthenticated-flows.spec.ts` - Tests for unauthenticated users
