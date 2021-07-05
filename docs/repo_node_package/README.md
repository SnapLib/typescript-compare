# TypeScript-Compare Repo Package

This repo is itself a Node package and as such has the features and structure
of a Node package. It utilizes other Node packages as dependencies and contains
scripts for executing certain tasks.

## Scripts

This package has scripts that serve 3 main purposes plus one extra
miscellaneous utility script.

1. building/generating

   There are 3 scripts that either compile the typescript source, generate
   tsdocs from its doc comments, and generate a test report for the results of
   the unit tests:

   - `build-dist`

      The "build-dist" script builds the distributable NPM package to be
      published to NPM.

   - `build-tsdoc`

      The "build-tsdoc" script generates the API documentation based on the doc
      comments in the TypeScript source code.

   - `test-report`

      The "test-report" script generates a web based test report based on the
      test results of the unit tests. It uses the results from calling the
      default test script.

1. linting

   There are 2 scripts that execute linting. 1 script executes a more lenient
   linting while the other is stricter.

   - `lint`

      The "lint" script is the default and more lenient linting script of the
      two. Only errors are reported while warnings are ignored.

   - `lint-strict`

      The "lint-strict" script is the stricter linting script. It reports both
      warnings and errors.

1. testing

   - `test`

      The "test" script executes all unit tests.

1. miscellanous

   - `tsnode`

      The "tsnode" script executes TypeScript files without having to compile
      them. If passed a path to a TypeScript file, it will execute the file.

## Package/Repo Structure

The root of this repo contains the majority of the config files as well as the
`src` and `docs` directory.
