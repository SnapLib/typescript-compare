"use strict";

const mocharc = require("./.mocharc");

module.exports =
{
    ...mocharc,
    reporter: "mochawesome",
    reporterOptions: [
        "autoOpen=true",
        "consoleReporter=none",
        "json=false",
        "reportDir=./build/test-report",
        "reportFilename=index",
        "reportPageTitle=ObjectComparer test report",
        "reportTitle=SnapLib Object Comparer Test Report",
        "showSkipped=false"
    ]
}
