"use strict";

const join = require("path").join;

module.exports =
{
    ...require("./.mocharc.cjs"),
    reporter: "mochawesome",
    reporterOptions: [
        "autoOpen=true",
        "consoleReporter=none",
        "json=false",
        `reportDir=${join(__dirname, "..", "..", "build", "test-report")}`,
        "reportFilename=index",
        "reportPageTitle=Compare test report",
        "reportTitle=SnapLib Compare Test Report",
        "showSkipped=false"
    ]
};
