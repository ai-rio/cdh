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
  transform: {
    "^.+\.(ts|tsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^gsap$": "<rootDir>/__mocks__/gsap.js",
    "^gsap/ScrollToPlugin$": "<rootDir>/__mocks__/gsap.js",
  },
};
