'use strict';

module.exports = {
  "root": true,
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 2019
  },
  "env": {
    "node": true
  },
  "rules": {
    "block-scoped-var": 2,
    "eqeqeq": [2, "smart"],
    "max-depth": [1, 3],
    "max-statements": [1, 30],
    "new-cap": 1,
    "no-extend-native": 2,
    "no-unused-vars": 1,
  },
  "ignorePatterns": [
    "coverage/**",
    "test/fixtures/**"
  ],
  "overrides": [
    {
      "files": ["test/**"],
      "env": {
        "mocha": true
      },
      "rules": {
        "max-len": 0,
        "max-statements": 0
      }
    }
  ]
}