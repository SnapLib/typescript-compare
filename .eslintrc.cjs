/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

module.exports = {
    root: true,
    ignorePatterns: ["!**/*.ts"],
    env:
    {
        es2020: true,
        node: true
    },
    extends:
    [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions:
    {
        ecmaVersion: 2020,
        sourceType: "module"
    },
    plugins:
    [
        "@typescript-eslint"
    ],
    rules:
    {
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-empty-function": "warn",
        "default-case": "error",
        "default-case-last": "error",
        "eol-last": "error",
        "no-console": "warn",
        "no-empty-function": "warn",
        "no-implicit-coercion": "error",
        "quotes": ["error", "double", {"avoidEscape": true, "allowTemplateLiterals": true}],
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "semi": "off",
        "@typescript-eslint/semi": ["error", "always"]
    }
};
