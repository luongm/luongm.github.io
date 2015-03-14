/**
 * Main logic of the problem
 */
define(function(require) {
    var $ = require("jquery"),
        _ = require("underscore"),
        Helpers = require("apps/sudoku/helpers");
        Constants = require("apps/sudoku/constants");

    var SudokuMain = {
        el: $("#app > #sudoku-grid"),

        setup: function() {
            var cells = Helpers.generateSudokuTable(SudokuMain.el);
        }
    };

    // Exports
    return SudokuMain;
});
