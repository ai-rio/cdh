const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "e2e/**/*.ts",
    baseUrl: "http://localhost:3000",
    supportFile: false,
  },
});