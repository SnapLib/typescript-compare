/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const join = require("path").join;

module.exports =
{
    extension: ["spec.ts"],
    recursive: true,
    require: ["ts-node/register"],
    spec: join(__dirname, "ts", "**", "*.spec.ts"),
    ui: "tdd"
}
