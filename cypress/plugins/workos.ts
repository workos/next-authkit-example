/**
 * WorkOS authentication plugin for Cypress
 * Provides tasks for programmatic authentication using WorkOS SDK
 */
export function registerWorkOSTasks(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) {
  on("task", {
    async authenticateWithWorkOS({ email, password }) {
      const { WorkOS } = await import("@workos-inc/node");
      const workos = new WorkOS(process.env.WORKOS_API_KEY!, {
        apiHostname: process.env.WORKOS_API_HOSTNAME!,
      });

      return workos.userManagement.authenticateWithPassword({
        clientId: process.env.WORKOS_CLIENT_ID!,
        email,
        password,
        session: {
          sealSession: true,
          cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
        },
      });
    },
  });
}
