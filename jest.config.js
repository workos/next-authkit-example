const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@workos-inc/authkit-nextjs$": "<rootDir>/node_modules/@workos-inc/authkit-nextjs/dist/esm/index.js",
    "^@workos-inc/authkit-nextjs/components$": "<rootDir>/node_modules/@workos-inc/authkit-nextjs/dist/esm/components/index.js",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@workos-inc/authkit-nextjs)",
  ],
};