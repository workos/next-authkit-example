describe("Authenticated User Flows", () => {
  beforeEach(() => {
    // Use username/password from environment variables
    cy.login(Cypress.env("TEST_EMAIL"), Cypress.env("TEST_PASSWORD"));
  });

  it("homepage shows authenticated state", () => {
    cy.visit("/");

    // Should see welcome message for authenticated user
    cy.contains(/welcome back/i).should("be.visible");

    // Should see account navigation
    cy.get("a")
      .contains(/view account/i)
      .should("be.visible");

    // Should see sign out button
    // There are multiple sign out buttons, so we need to make sure we see at least one
    cy.get("button")
      .contains(/sign out/i)
      .first()
      .should("be.visible");

    // Should NOT see sign in button
    cy.get("a")
      .contains(/sign in/i)
      .should("not.exist");
  });

  it("can navigate to account page", () => {
    cy.visit("/");

    // Click on "View account" link
    cy.get("a")
      .contains(/view account/i)
      .click();

    // Should navigate to account page
    cy.url().should("include", "/account");

    // Should see account details heading
    cy.get("h1, h2, h3")
      .contains(/account details/i)
      .should("be.visible");

    // Should see some user information fields
    cy.contains("Email").should("be.visible");

    // Should see the email address in a readonly input
    cy.get("input[readonly]")
      .filter(`[value="${Cypress.env("TEST_EMAIL")}"]`)
      .should("exist");

    // Should see user ID field
    cy.contains("Id", { matchCase: false }).should("be.visible");
  });

  it("account page is protected - direct access works when authenticated", () => {
    // Direct navigation to protected route should work when authenticated
    cy.visit("/account");

    // Should see account details page
    cy.get("h1, h2, h3")
      .contains(/account details/i)
      .should("be.visible");

    // Should see user information
    cy.contains("Email").should("be.visible");
  });

  it("can sign out successfully", () => {
    cy.visit("/");

    // Verify we start authenticated
    cy.contains(/welcome back/i).should("be.visible");

    // Click sign out button
    cy.get("button")
      .contains(/sign out/i)
      .first()
      .click();

    // Wait for sign out to complete and page to update
    cy.url().should("eq", Cypress.config("baseUrl") + "/");

    // Should see unauthenticated state
    cy.get("h1, h2, h3")
      .contains(/authkit authentication example/i)
      .should("be.visible");
    cy.get("a")
      .contains(/sign in with authkit/i)
      .should("be.visible");
    cy.contains(/sign in to view your account details/i).should("be.visible");

    // Should NOT see authenticated elements
    cy.contains(/welcome back/i).should("not.exist");
    cy.contains(/sign out/i).should("not.exist");
  });

  it("navigation between pages works correctly", () => {
    // Start at home
    cy.visit("/");
    cy.contains(/welcome back/i).should("be.visible");

    // Go to account
    cy.get("a")
      .contains(/view account/i)
      .click();
    cy.url().should("include", "/account");
    cy.get("h1, h2, h3")
      .contains(/account details/i)
      .should("be.visible");

    // Go back to home via browser navigation
    cy.go("back");
    cy.url().should("not.include", "/account");
    cy.contains(/welcome back/i).should("be.visible");

    // Go forward again
    cy.go("forward");
    cy.url().should("include", "/account");
    cy.get("h1, h2, h3")
      .contains(/account details/i)
      .should("be.visible");
  });
});
