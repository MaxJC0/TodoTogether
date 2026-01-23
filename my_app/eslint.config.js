// eslint.config.js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const react = require("eslint-plugin-react/configs/recommended");

module.exports = defineConfig([
	expoConfig,
	react,
	{
		rules: {
			"react/react-in-jsx-scope": "off",
		},
		ignores: ["dist/*"],
	},
]);
