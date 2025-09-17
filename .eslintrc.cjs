module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: false,
  },
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  globals: {
    process: "readonly",
  },
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "off",
    "no-unused-vars": "off",
    "no-useless-escape": "off",
  },
  overrides: [
    {
      files: [
        "*.config.js",
        "*.config.cjs",
        "*.config.mjs",
        "vite.config.mjs",
        "postcss.config.js",
        "tailwind.config.js",
      ],
      env: {
        node: true,
        browser: false,
      },
    },
  ],
};
