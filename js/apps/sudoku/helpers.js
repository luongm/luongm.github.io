/**
 * Contains all helper functions
 */
define(function(require) {
    var $ = require("jquery"),
        Templates = require("apps/sudoku/templates");

    var Helpers = {
        cells: {}, // a 'cache' of all individual cells for faster lookup later

        /**
         * Logic helpers
         */
         validateInput: function() {

         },

        /**
         * Rendering helpers
         */
        // programmatically generate sudoku table
        generateSudokuTable: function(sudokuTableEl, board) {
            sudokuTableEl.empty();
            for (var r = 0; r < 9; r++) {
                var row = $("<tr>");
                var boardRow = board[row] || {};
                Helpers.cells[r] = Helpers.cells[r] || {};
                for (var c = 0; c < 9; c++) {
                    var templateToUse = boardRow[c]
                        ? Templates.fixedCellTemplate
                        : Templates.editableCellTemplate;
                    Helpers.cells[r][c] = $(templateToUse({
                        row: r,
                        col: c,
                        tabIndex: r*9 + c + 1,
                        num: boardRow[c]
                    }));
                    row.append(Helpers.cells[r][c]);
                }
                sudokuTableEl.append(row);
            }

            Helpers.registerTableNavigationListeners();
        },

        registerTableNavigationListeners: function() {
            _.each(Helpers.cells, function(row) {
                _.each(row, function(cell) {
                    cell.on("keyup", function(event) {
                        switch(event.which) {
                            case 9: // tab
                            case 37: // left
                            case 38: // up
                            case 39: // right
                            case 40: // down
                                event.preventDefault();
                                break;
                            default:
                                // default behavior
                        }
                    });
                    cell.on("keydown", function(event) {
                        switch(event.which) {
                            case 9: // tab
                            case 37: // left
                            case 38: // up
                            case 39: // right
                            case 40: // down
                                event.preventDefault();
                                Helpers.navigate(cell, event);
                                break;
                            default:
                                // default behavior
                        }
                    });
                    cell.on("click", function() {
                        cell.addClass("editing");
                        cell.find("input").focus();
                    });
                    cell.find("input").on("blur", function() {
                        cell.removeClass("editing");
                    });
                });
            });
        },

        navigate: function(currentCell, event) {
            var newRowIndex = currentCell.data('row'),
                newColIndex = currentCell.data('col');
            switch(event.which) {
                case 9: // tab
                    newColIndex = (newColIndex+1) % 9;
                    if (newColIndex == 0) {
                        newRowIndex = (newRowIndex+1) % 9;
                    }
                    break;
                case 37: // left
                    newColIndex--;
                    newColIndex < 0 && (newColIndex = 0);
                    break;
                case 38: // up
                    newRowIndex--; // up means lower row index first
                    newRowIndex < 0 && (newRowIndex = 0);
                    break;
                case 39: // right
                    newColIndex++;
                    newColIndex > 8 && (newColIndex = 8);
                    break;
                case 40: // down
                    newRowIndex++; // down means high row index
                    newRowIndex > 8 && (newRowIndex = 8);
                    break;
            }
            var newCell = Helpers.cells[newRowIndex][newColIndex];
            var input = newCell.find("input");
            currentCell.removeClass("editing");
            newCell.addClass("editing");

            // focus on the input if the newCell is editable
            if (input.size() == 0) {
                newCell.focus();
            } else {
                input.focus();
            }
        }
    };

    // Exports
    return Helpers;
});
