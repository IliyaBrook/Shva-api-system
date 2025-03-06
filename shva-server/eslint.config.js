import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import eslintGlobalRules from '../sharable/eslint-global-rules.js'

export default tseslint.config(
  { ignores: ['dist', '.idea', '.vscode', 'build'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      ...eslintGlobalRules,
    },
  },
)
