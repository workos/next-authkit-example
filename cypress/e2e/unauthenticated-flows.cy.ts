describe("Unauthenticated User Flows", () => {
  it("homepage shows unauthenticated state", () => {
    cy.visit("/");

    // Should see the unauthenticated homepage
    cy.get("h1, h2, h3")
      .contains(/authkit authentication example/i)
      .should("be.visible");
    cy.contains(/sign in to view your account details/i).should("be.visible");

    // Should see sign in button
    cy.get("a")
      .contains(/sign in with authkit/i)
      .should("be.visible");

    // Should NOT see authenticated elements
    cy.contains(/welcome back/i).should("not.exist");
    cy.get("a")
      .contains(/view account/i)
      .should("not.exist");
    cy.contains("button", /sign out/i).should("not.exist");
  });

  it("account page redirects unauthenticated users to login", () => {
    // Try to access protected route directly
    cy.visit("/account");

    // Should be redirected to WorkOS login (the URL will change away from the app)
    cy.url({ timeout: 10000 }).should("not.contain", "/account");

    cy.get("input").should("be.visible");
  });

  it("sign in button navigates to WorkOS login", () => {
    cy.visit("/");

    // Click the sign in button
    cy.get("a")
      .contains(/sign in with authkit/i)
      .click();

    // URL should not be the original app URL
    const baseURL = Cypress.env("TEST_BASE_URL");
    cy.url().should("not.eq", baseURL + "/");
    cy.url().should("not.contain", new URL(baseURL).host);
  });
});
