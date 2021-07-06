# TypeScript-Compare Repo Node Package

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

1. miscellaneous

   - `tsnode`

      The "tsnode" script executes TypeScript files without having to compile
      them. If passed a path to a TypeScript file, it will execute the file.

## Repo Node Package Structure

The root of this repo contains the majority of the config files as well as the
`src` and `docs` directory.

### src directory

The `src` directory contains all the TypeScript source code of this repository.
This includes both the TypeScript source code that gets compiled to the
JavaScript distributable as well as the source code that makes up the unit
tests.

The `src` directory has 2 directory in its root. The `main` directory and the
`test` directory.

#### src/main

The `main` directory contains all the source code that gets compiled to the
JavaScript distributable that gets published to NPM and imported by other Node
packages. The [tsconfig.json][1] file located in the root of this repo is used
to configure the compiler output.

#### src/test

The `test` directory contains all the source code that gets *executed* (not
compiled) when running the unit tests. It contains its own config files that
are more appropriate for running unit tests.

1. It contains its own [tsconfig.json][2] to configure the test source code to
   be compiled to include source maps, ignore errors, and not emit any output
   files.

1. It contains a [.mocharc.cjs][3] to configure Mocha to be executed with
   the test results reported to the shell (via stdout).

1. It contains a [report.mocharc.cjs][3] to configure Mocha to use
   [`Mochawesome`][4] as the reporter and generate an html/css based report.

## NOTE

While this repo is a Node package, it is **not** the package that gets
published/distributed to the NPM to be imported and used by other Node packages.
It is used for development purposes only and *builds* the distributable package
that is intended to be published to NPM and ultimately imported and used by
other Node packages. The root `package.json` file located in the root directory
of this repo has `private` set to `true` to prevent it from being published to
the NPM. Instead, the built distributable package contains its own
`package.json` file with its properties appropriately set.

[1]: ../../tsconfig.json "root tsconfig"
[2]: ../../src/test/tsconfig.json "tsconfig for testing"
[3]: ../../src/test/.mocharc.cjs "mocharc for shell based reporting"
[4]: https://www.npmjs.com/package/mochawesome "mochawesome"
