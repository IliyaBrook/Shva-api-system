const eslintGlobalRules = {
  'prefer-const': 'error',
  'no-var': 'error',
  'eqeqeq': ['error', 'always'],
  'no-unused-vars': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn'],
  '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
  'consistent-return': 'error',
  'no-async-promise-executor': 'error',
  'curly': 'error'
}

export default eslintGlobalRules