/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    "extends": [
      "plugin:vue/vue3-recommended"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    }
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
      alias: {
        map: [
          ['@', path.resolve(__dirname, 'src')],
        ],
        extensions: ['.ts', '.vue', '.js', '.json']
      }
    },
  },
}
