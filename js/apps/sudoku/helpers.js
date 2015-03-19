/**
 * Contains all helper functions
 */
define(function(require) {
    var $ = require("jquery"),
        Cell = require("apps/sudoku/cell");

    var Helpers = {
        cells: {}, // a 'cache' of all individual cells for faster lookup later

        /**
         * Programmatically generate sudoku table
         * @param rowsOfCells list of string representation of each row
         */
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
        },

        /**
         * Validates row, column and the 3x3 square of that contains cell [r,c]
         */
        validateInput: function(changedCell) {
            if (changedCell.value.length != 1) {
                // this cell is empty or is in pencil mode -> no need validations
                return;
            }
            for (var r = 0; r < 9; r++) {
                for (var c = 0; c < 9; c++) {
                    Helpers.cells[r][c].resetErrorCount();
                }
            }


            // 1) validate all rows
            for (var r = 0; r < 9; r++) {
                Helpers.checkDuplicate(r, r, 0, 8);
            }

            // 2) validate all columns
            for (var c = 0; c < 9; c++) {
                Helpers.checkDuplicate(0, 8, c, c);
            }

            // 3) validateAllColumns
            for (var i = 0; i < 3; i++) {
                var minRow = i*3;
                for (var j = 0; j < 3; j++) {
                    var minCol = j*3;
                    Helpers.checkDuplicate(minRow, minRow+2, minCol, minCol+2);
                }
            }
        },

        checkDuplicate: function(minR, maxR, minC, maxC) {
            var cells = []
            var currentValues = [];
            var hasDuplicates = false;
            for (var r = minR; r <= maxR; r++) {
                for (var c = minC; c <= maxC; c++) {
                    var cell = Helpers.cells[r][c];
                    if (hasDuplicates) {
                        // increment the rest of the cells for now
                        // we will increment the first part later
                        cell.incrementErrorCount();
                        continue;
                    }
                    cells.push(cell);

                    var value = cell.value;
                    if (value.length != 1) {
                        continue;
                    }
                    if (currentValues[value]) {
                        hasDuplicates = true;
                        continue;
                    }
                    currentValues[value] = true;
                }
            }
            // increment the first cells that we passed over
            if (hasDuplicates) {
                for (var i = 0; i < cells.length; i++) {
                    cells[i].incrementErrorCount();
                }
            }
        }
    };

    // Exports
    return Helpers;
});
