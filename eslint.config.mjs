// eslint.config.js

import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // This section handles ignored files, replacing the old .eslintignore file.
  {
    // Migrate patterns from .eslintignore here to silence the deprecation warning.
    ignores: ["node_modules/", "dist/", "uploads/", ".env"],
  },

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  pluginJs.configs.recommended,
  eslintConfigPrettier,

  // This section fixes the '_e' is defined but never used error.
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // For function arguments: (req, res, _next)
          varsIgnorePattern: "^_", // For variables: const _e = ...
        },
      ],
    },
  },
];
