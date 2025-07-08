// eslint.config.mjs

import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import css from '@eslint/css';
import pluginJest from 'eslint-plugin-jest';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // ✅ Base JS/React config
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Optional: turn off for React 17+
    },
    extends: ['plugin:react/recommended', 'js/recommended'],
  },

  // ✅ JSON
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json',
    extends: ['plugin:json/recommended'],
  },

  // ✅ CSS
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css',
    extends: ['plugin:css/recommended'],
  },

  // ✅ Jest (for test files)
  {
    files: ['**/*.test.{js,jsx}', '**/__tests__/**/*.{js,jsx}'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
    },
  },
]);
