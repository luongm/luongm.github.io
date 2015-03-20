require.config({
    baseUrl: "js",
    paths: {
        jquery: [
            "libs/jquery-1.11.2.min",
            "http://code.jquery.com/jquery-1.11.2"
        ],
        underscore: [
            "libs/underscore-1.8.2.min",
            "http://underscorejs.org/underscore"
        ]
    },
    shim: { // dependencies
    }
});

define(function(require) {
    var SudokuMain = require("apps/sudoku/sudoku-main");
    var Tests = require("apps/sudoku/tests");

    // setup table, and add event listeners
    var sudokuApp = new SudokuMain({
        el: $("#app"),
        board: Tests.testCases[0]
    });

    sudokuApp.render();
});
