// .eslintrc.js
module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: { presets: ["@babel/preset-react"] },
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  plugins: [
    "react",
    "react-hooks",
    "jsx-a11y"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
   rules: {
    'react/prop-types': 'off',
    // other overrides…
  }
};
