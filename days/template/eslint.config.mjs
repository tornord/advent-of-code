import globals from "globals";

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    settings: {},
    rules: {
      "arrow-parens": 0,
      "arrow-spacing": 0,
      "brace-style": 0,
      "callback-return": 2,
      camelcase: 0,
      "comma-spacing": 0,
      curly: 0,
      "dot-notation": 0,
      "eol-last": 0,
      eqeqeq: 2,
      "handle-callback-err": 2,
      "key-spacing": 0,
      "keyword-spacing": 0,
      "new-cap": 2,
      "new-parens": 1,
      "no-alert": 2,
      "no-array-constructor": 2,
      "no-caller": 2,
      "no-catch-shadow": 2,
      "no-cond-assign": 2,
      "no-console": 0,
      "no-duplicate-imports": 0,
      "no-empty": 0,
      "no-eval": 2,
      "no-extend-native": 2,
      "no-extra-bind": 2,
      "no-extra-parens": [1, "functions"],
      "no-implied-eval": 2,
      "no-iterator": 2,
      "no-label-var": 2,
      "no-labels": 2,
      "no-lone-blocks": 2,
      "no-loop-func": 2,
      "no-multi-spaces": 0,
      "no-multi-str": 2,
      "no-multiple-empty-lines": 1,
      "no-native-reassign": 2,
      "no-new": 2,
      "no-new-func": 2,
      "no-new-object": 2,
      "no-new-symbol": 2,
      "no-new-wrappers": 2,
      "no-octal-escape": 2,
      "no-path-concat": 2,
      "no-process-exit": 2,
      "no-proto": 2,
      "no-prototype-builtins": 0,
      "no-return-assign": 0,
      "no-script-url": 2,
      "no-sequences": 2,
      "no-shadow": 1,
      "no-shadow-restricted-names": 2,
      "no-spaced-func": 2,
      "no-trailing-spaces": 0,
      "no-undef": 2,
      "no-underscore-dangle": 0,
      "no-unreachable": 1,
      "no-unused-expressions": 2,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-use-before-define": [2, "nofunc"],
      "no-var": 2,
      "no-with": 2,
      "prefer-arrow-callback": 2,
      "prefer-const": 0,
      "prefer-template": 1,
      quotes: [1, "double"],
      semi: 0,
      "semi-spacing": 0,
      "sort-imports": 0,
      "space-before-blocks": 0,
      "space-before-function-paren": [1, { anonymous: "always", named: "never" }],
      "space-infix-ops": 0,
      "space-unary-ops": [1, { words: true, nonwords: false }],
      strict: [2, "global"],
      yoda: [1, "never"],
    },
  },
];
