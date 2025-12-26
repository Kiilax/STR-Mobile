const { defineConfig } = require("eslint/config")
const expoConfig = require("eslint-config-expo/flat")
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended")
const tsPlugin = require("@typescript-eslint/eslint-plugin")
const tsParser = require("@typescript-eslint/parser")

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    ignores: [
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
      "expo-env.d.ts",
      "node_modules/",
      "android/",
      "ios/",
      "build/",
      "dist/",
      "coverage/",
    ],

    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "no-var": "error",
      "no-unused-vars": "warn",
      quotes: ["error", "double"],
      "prefer-const": "error",
    },
  },
])
