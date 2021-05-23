"use strict";

const join = require("path").join

module.exports =
{
    extension: ["spec.ts"],
    recursive: true,
    require: [join("ts-node", "register")],
    spec: join("src", "test", "**", "*.spec.ts"),
    ui: "tdd"
}
