module.exports = {
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["<rootDir>/tests/**/*.+(ts|tsx|js)", "<rootDir>/src/**/*.+(spec|test).+(ts|tsx|js)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^gsap$": "<rootDir>/__mocks__/gsap.js",
    "^gsap/ScrollToPlugin$": "<rootDir>/__mocks__/gsap.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
};
