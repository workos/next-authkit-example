# E2E Testing with Cypress and WorkOS AuthKit

This directory contains Cypress tests for WorkOS AuthKit authentication using programmatic authentication.

## Setup

1. **Environment Variables** (same as Playwright tests)

```bash
# WorkOS Configuration
WORKOS_CLIENT_ID=your_client_id
WORKOS_API_KEY=your_api_key
WORKOS_COOKIE_PASSWORD=your_cookie_password

# Test Configuration
TEST_BASE_URL=http://localhost:3000
```

2. **Run Tests**

```bash
npm run test:cypress        # Headless
npm run test:cypress:open   # Interactive
```

## Authentication

### **Custom Command**

```typescript
// Authenticate as specific user
cy.login(Cypress.env("TEST_EMAIL"), Cypress.env("TEST_PASSWORD"));
```

### **Session Caching**

- First use: API authentication + session creation
- Subsequent uses: Cached session (faster)
- Auto-validation: Ensures session is still valid

## Usage

**Authenticated Tests:**

```typescript
describe("Admin Features", () => {
  beforeEach(() => {
    cy.login(Cypress.env("TEST_EMAIL"), Cypress.env("TEST_PASSWORD"));
  });

  it("can access admin panel", () => {
    cy.visit("/admin"); // Already authenticated
  });
});
```

**Unauthenticated Tests:**

```typescript
describe("Public Features", () => {
  // No beforeEach = unauthenticated

  it("shows login page", () => {
    cy.visit("/");
  });
});
```

## Files

- `plugins/workos.ts` - WorkOS authentication plugin
- `support/commands.ts` - Authentication command
- `support/e2e.ts` - Test configuration
- `e2e/authenticated-flows.cy.ts` - Tests for logged-in users
- `e2e/unauthenticated-flows.cy.ts` - Tests for anonymous users
