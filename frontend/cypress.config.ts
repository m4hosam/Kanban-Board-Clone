// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:8080",
    env: {
      apiUrl: "http://localhost:3000", // adjust this to match your API URL
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
