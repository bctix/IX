// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.strict,
  ],
  languageOptions: {
    globals: {
      process: "readonly",
      console: "readonly",

    }
  },
  rules: {
    "no-shadow": ["error"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "prefer-const": "warn",
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "no-multi-spaces": "error",
  },
},
{
  ignores: ["**/*/*.js"],
});