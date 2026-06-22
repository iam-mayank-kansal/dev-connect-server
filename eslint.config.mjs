import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/", "dist/", "uploads/", ".env"],
  },

  pluginJs.configs.recommended,

  // ✅ TypeScript support (IMPORTANT)
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
      },
    },
  },

  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  eslintConfigPrettier,
];
