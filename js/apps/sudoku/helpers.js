/**
 * Contains all helper functions
 */
define(function(require) {
    var $ = require("jquery"),
        Cell = require("apps/sudoku/cell");

    var Helpers = {
        cells: {}, // a 'cache' of all individual cells for faster lookup later

        /**
         * Logic helpers
         */
         validateInput: function() {

         },

        /**
         * Rendering helpers
         * @param rowsOfCells list of string representation of each row
         */
        // programmatically generate sudoku table
        generateSudokuTable: function(sudokuTableEl, board) {
            sudokuTableEl.empty();

            for (var r = 0; r < 9; r++) {
                var row = $("<tr>");
                var boardRow = board[r] || '';
                Helpers.cells[r] = Helpers.cells[r] || {};
                for (var c = 0; c < 9; c++) {
                    Helpers.cells[r][c] = new Cell({
                        r: r,
                        c: c,
                        num: boardRow[c],
                        Helpers: Helpers
                    });
                    row.append(Helpers.cells[r][c].render().$el)
                }
                sudokuTableEl.append(row);
            }
        }
    };

    // Exports
    return Helpers;
});
