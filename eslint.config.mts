import * as js from "@eslint/js";
import * as globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.{ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    files: ["tests/**/*.{ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    ignores: [
      "build/**",
      "dist/**",
      "node_modules/**",
      "**/*.d.ts",
      "eslint.config.{js,cjs,mjs,ts,mts,cts}",
      "jest.config.{js,cjs,mjs,ts,mts,cts}",
      "commitlint.config.{js,cjs,mjs,ts,mts,cts}",
      "tsconfig*.json",
      "coverage/**",
      ".husky/_/**",
      ".vscode/**",
    ],
  },
]);
