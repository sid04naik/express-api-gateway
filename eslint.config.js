const { ESLint } = require("eslint");
module.exports = new ESLint({
  baseConfig: {
    env: {
      es2021: true,
      node: true,
      jest: true,
    },
    extends: ["airbnb-base", "plugin:jest/recommended", "plugin:prettier/recommended"],
    plugins: ["jest", "prettier"],
    parserOptions: {
      ecmaVersion: 2021,
    },
    rules: {
      "no-console": "error",
      "func-names": "off",
      "no-underscore-dangle": "off",
      "consistent-return": "off",
      "jest/expect-expect": "off",
      "security/detect-object-injection": "off",
    },
  },
});
