/**
 * Custom command for programmatic authentication
 * Uses cy.session for caching per username-password combination
 * Follows the same pattern as Playwright tests
 */
Cypress.Commands.add("login", (username, password) => {
  if (!username || !password) {
    throw new Error("Both username and password are required");
  }

  // Create cache key from username and password
  const sessionId = `${username}-${password}`;

  cy.session(
    sessionId,
    () => {
      const cookieName = Cypress.env("WORKOS_COOKIE_NAME") ?? "wos-session";

      cy.log(`Authenticating user: ${username}`);

      // Step 1: Authenticate with WorkOS API directly (same as Playwright)
      return cy
        .task("authenticateWithWorkOS", {
          email: username, // Treat username as email
          password: password,
        })
        .then((authResponse) => {
          cy.log("API authentication successful");
          // set the wos-session cookie
          cy.setCookie(cookieName, authResponse.sealedSession!);
        });
    },
    {
      validate() {
        // Validate that the session is still valid by checking authenticated state
        cy.visit("/");
        cy.get("body").should("contain.text", "Welcome back");
      },
    },
  );
});
