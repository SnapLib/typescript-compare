"use strict";

module.exports =
{
    ...require("./.mocharc"),
    reporter: "mochawesome",
    reporterOptions: [
        "autoOpen=true",
        "consoleReporter=none",
        "json=false",
        "reportDir=./build/test-report",
        "reportFilename=index",
        "reportPageTitle=ObjectCompare test report",
        "reportTitle=SnapLib Object Comparer Test Report",
        "showSkipped=false"
    ]
};
