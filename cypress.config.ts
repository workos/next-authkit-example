import { defineConfig } from "cypress";
import dotenv from "dotenv";
import path from "path";
import { registerWorkOSTasks } from "./cypress/plugins/workos";

// Load environment variables from .env files
dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  e2e: {
    baseUrl: process.env.TEST_BASE_URL,
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      // Register WorkOS authentication tasks
      registerWorkOSTasks(on, config);

      // Pass through environment variables to Cypress
      config.env = {
        ...config.env,
        WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
        WORKOS_API_KEY: process.env.WORKOS_API_KEY,
        TEST_BASE_URL: process.env.TEST_BASE_URL,
        TEST_EMAIL: process.env.TEST_EMAIL,
        TEST_PASSWORD: process.env.TEST_PASSWORD,
      };
      return config;
    },
  },
});
