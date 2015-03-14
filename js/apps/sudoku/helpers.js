/**
 * Contains all helper functions
 */
define(function(require) {
    var $ = require("jquery"),
        Templates = require("apps/sudoku/templates");

    var Helpers = {
        /**
         * Logic helpers
         */
         validateInput: function() {

         },

        /**
         * Rendering helpers
         */
        // programmatically generate sudoku table
        generateSudokuTable: function(sudokuTable) {
            for (var r = 0; r < 9; r++) {
                var row = $("<tr>");
                for (var c = 0; c < 9; c++) {
                    row.append(Templates.fixedCellTemplate({
                        row: r,
                        col: c,
                        num: r + "," + c
                    }));
                }
                sudokuTable.append(row);
            }
            return {}; // maybe return a 'cache' of all individual cells for faster lookup later
        }
    };

    // Exports
    return Helpers;
});
