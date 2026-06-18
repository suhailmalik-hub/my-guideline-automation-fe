const { createDefaultPreset } = require("ts-jest");

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { 
      tsconfig: {
        jsx: "react-jsx",
        esModuleInterop: true,
        verbatimModuleSyntax: false
      }
    }],
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
};