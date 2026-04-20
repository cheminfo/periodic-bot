import { defineConfig, globalIgnores } from 'eslint/config';
import cheminfo from 'eslint-config-cheminfo';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['coverage']),
  cheminfo,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['src/index.js'],
    rules: {
      'no-console': 'off',
      camelcase: 'off',
    },
  },
);
