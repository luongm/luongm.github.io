require.config({
    baseUrl: "js",
    paths: {
        jquery : "libs/jquery-1.11.2.min",
        underscore : "libs/underscore-1.8.2.min"
    },
    shim: { // dependencies
    }
});

define(function(require) {
    var SudokuMain = require("apps/sudoku/sudoku-main");

    // setup table, and add event listeners
    SudokuMain.setup();
});
