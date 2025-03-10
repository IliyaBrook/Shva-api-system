/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config, import("@trivago/prettier-plugin-sort-imports").PluginConfig}
 */
const config= {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 130,
  tabWidth: 2,
  useTabs: false,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder:[
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/hooks/(.*)$',
    '^@/assets/(.*)$',
    '^@/utils/(.*)$',
    '^@/types/(.*)$',
    '^../(.*)$',
    '^./(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  overrides: [
    {
      files: ['*.json', '*.yaml', '*.yml'],
      options: {
        tabWidth: 2,
        useTabs: false,
      },
    },
  ],
}

export default config
