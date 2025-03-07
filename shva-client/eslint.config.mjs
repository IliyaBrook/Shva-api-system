import js from "@eslint/js";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import eslintGlobalRules from "../configs/eslint-global-rules.js";
import react from "eslint-plugin-react";

// noinspection JSUnusedGlobalSymbols
export default tseslint.config(
  {
    ignores: [
      "dist",
      ".idea",
      ".vscode",
      "build",
      "node_modules",
      ".react-router",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      react: react,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...eslintGlobalRules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/function-component-definition": [
        2,
        {
          namedComponents: "arrow-function",
        },
      ],
    },
  },
);
