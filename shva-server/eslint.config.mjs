import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import eslintGlobalRules from "../configs/eslint-global-rules.js";

// noinspection JSUnusedGlobalSymbols
export default tseslint.config(
  { ignores: ["dist", ".idea", ".vscode", "build", "node_modules"] },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      ...eslintGlobalRules,
      "no-unused-vars": [
        "warn", {
          "ignoreRestSiblings": true,
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn", {
          "ignoreRestSiblings": true,
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
    },
  },
);
