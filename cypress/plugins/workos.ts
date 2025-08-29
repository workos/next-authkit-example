import type { PluginEvents, PluginConfigOptions } from "cypress";

interface AuthenticateParams {
  email: string;
  password: string;
  workosApiKey: string;
  workosClientId: string;
}

/**
 * WorkOS authentication plugin for Cypress
 * Provides tasks for programmatic authentication using WorkOS SDK
 */
export function registerWorkOSTasks(
  on: PluginEvents,
  config: PluginConfigOptions
) {
  on("task", {
    authenticateWithWorkOS({
      email,
      password,
      workosApiKey,
      workosClientId,
    }: AuthenticateParams) {
      // Import WorkOS SDK in Node.js context (can't be imported in browser context)
      const { WorkOS } = require("@workos-inc/node");

      const workos = new WorkOS(workosApiKey, {
        apiHostname: process.env.WORKOS_API_HOSTNAME,
      });

      return workos.userManagement.authenticateWithPassword({
        clientId: workosClientId,
        email,
        password,
      });
    },
  });
}
