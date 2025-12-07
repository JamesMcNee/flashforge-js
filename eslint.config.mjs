// @ts-check

import stylistic from "@stylistic/eslint-plugin"

import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strict,
  {
    ignores: ["**/*.js"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
)
