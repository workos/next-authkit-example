/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login as the specified user using programmatic authentication
       * @param username - Username (email) to authenticate as
       * @param password - Password to authenticate with
       */
      login(username: string, password: string): Chainable<void>;
    }
  }
}

/**
 * Custom command for programmatic authentication
 * Uses cy.session for caching per username-password combination
 * Follows the same pattern as Playwright tests
 */
Cypress.Commands.add("login", (username: string, password: string) => {
  if (!username || !password) {
    throw new Error("Both username and password are required");
  }

  // Create cache key from username and password
  const sessionId = `${username}-${password}`;

  cy.session(
    sessionId,
    () => {
      const workosApiKey = Cypress.env("WORKOS_API_KEY");
      const workosClientId = Cypress.env("WORKOS_CLIENT_ID");
      const baseURL = Cypress.env("TEST_BASE_URL");

      if (!workosApiKey || !workosClientId) {
        throw new Error(
          "Missing WORKOS_API_KEY or WORKOS_CLIENT_ID in Cypress environment"
        );
      }

      cy.log(`Authenticating user: ${username}`);

      // Step 1: Authenticate with WorkOS API directly (same as Playwright)
      cy.task("authenticateWithWorkOS", {
        email: username, // Treat username as email
        password: password,
        workosApiKey,
        workosClientId,
      }).then((authResponse: any) => {
        cy.log("API authentication successful");

        // Step 2: Call our test endpoint to save the session (same as Playwright)
        cy.request({
          method: "POST",
          url: `${baseURL}/api/test/set-session`,
          body: {
            user: authResponse.user,
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          cy.log("Session saved successfully");

          // The endpoint sets the cookie
          // Cypress handles cookies from cy.request responses automatically
        });
      });
    },
    {
      validate() {
        // Validate that the session is still valid by checking authenticated state
        cy.visit("/");
        cy.get("body").should("contain.text", "Welcome back");
      },
    }
  );
});

export {};
