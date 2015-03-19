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
            var row = changedCell.r;
            var col = changedCell.c;
            var val, r, c, cell;

            if (changedCell.value.length == 1) {
                // this cell is empty or is in pencil mode -> no need validations
                return;
            }

            var duplicateCells = {};
            // validate row
            var hasDuplicates = false;
            var currentValues = [];
            for (c = 0; c < 9; c++) {
                cell = Helpers.cells[row][c];
                cell.updateErrorCount(false); // decrement before checking
                if (hasDuplicates) {
                    continue;
                }

                val = cell.value; // 0-9
                if (val.length != 1) {
                    // ignore empty cells and pencil-mode cells
                    continue;
                }
                if (currentValues[val]) {
                    hasDuplicates = true;
                }
                currentValues[val] = true;
            }
            for (c = 0; c < 9; c++) {
                hasDuplicates && (duplicateCells[row+""+c] = Helpers.cells[row][c]);
                Helpers.cells[row][c].updateErrorCount(hasDuplicates);
            }

            // validate column
            hasDuplicates = false;
            currentValues = [];
            for (r = 0; r < 9; r++) {
                cell = Helpers.cells[r][col];
                !duplicateCells[r+""+col] && cell.updateErrorCount(false); // decrement before checking
                if (hasDuplicates) {
                    continue;
                }

                val = cell.value; // 0-9
                if (val.length != 1) {
                    // ignore empty cells and pencil-mode cells
                    continue;
                }
                if (currentValues[val]) {
                    hasDuplicates = true;
                }
                currentValues[val] = true;
            }
            for (r = 0; r < 9; r++) {
                hasDuplicates && (duplicateCells[row+""+c] = Helpers.cells[row][c]);
                Helpers.cells[r][col].updateErrorCount(hasDuplicates);
            }

            // validate 3x3 square
            hasDuplicates = false;
            currentValues = [];
            var minRow = Math.floor(row/3)*3;
            var minCol = Math.floor(col/3)*3;
            for (r = minRow; r < minRow+3; r++) {
                for (c = minCol; c < minCol+3; c++) {
                    cell = Helpers.cells[r][c];
                    !duplicateCells[r+""+c] && cell.updateErrorCount(false); // decrement before checking
                    if (hasDuplicates) {
                        continue;
                    }

                    val = cell.value; // 0-9
                    if (val.length != 1) {
                        // ignore empty cells and pencil-mode cells
                        continue;
                    }
                    if (currentValues[val]) {
                        hasDuplicates = true;
                    }
                    currentValues[val] = true;
                }
            }
            for (r = minRow; r < minRow+3; r++) {
                for (c = minCol; c < minCol+3; c++) {
                    hasDuplicates && (duplicateCells[row+""+c] = Helpers.cells[row][c]);
                    Helpers.cells[r][c].updateErrorCount(hasDuplicates);
                }
            }
        }
    };

    // Exports
    return Helpers;
});
