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

        /**
         * @params board: {Object} { 0: { 1: 4 } } -> [row 0, col 1] is 4
         */
        setup: function(board) {
            var cells = Helpers.generateSudokuTable(SudokuMain.el, board || {});
            $("#orientation-warning button.warning-ignored").click(function() {
                $("#orientation-warning").hide();
            });
        }
    };

    // Exports
    return SudokuMain;
});
