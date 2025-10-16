// eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const react = require('eslint-plugin-react/configs/recommended');
const reactHooks = require('eslint-plugin-react-hooks/configs/recommended');

module.exports = defineConfig([
  expoConfig,
  react,
  reactHooks,
  {
    ignores: ['dist/*'],
  },
]);
