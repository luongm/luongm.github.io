define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        Cell = require("apps/sudoku/cell");

    var Grid = function(options) {
        this.board = options.board;
        this.$el = options.el;
        this.cells = {};
    };

    /**
     * Programmatically generate sudoku table
     * @param rowsOfCells list of string representation of each row
     */
    _.extend(Grid.prototype, {
        render: function() {
            this.$el.empty();

            for (var r = 0; r < 9; r++) {
                var row = $("<tr>");
                var boardRow = this.board[r] || '';
                this.cells[r] = this.cells[r] || {};
                for (var c = 0; c < 9; c++) {
                    this.cells[r][c] = new Cell({
                        r: r,
                        c: c,
                        num: boardRow[c],
                        grid: this
                    });
                    row.append(this.cells[r][c].render().$el)
                }
                this.$el.append(row);
            }
        },

        /**
        * Validates row, column and the 3x3 square of that contains cell [r,c]
        */
        validateInput: function(changedCell) {
            var isDone = true,
                hasDuplicates = false;
            for (var r = 0; r < 9; r++) {
                for (var c = 0; c < 9; c++) {
                    var cell = this.cells[r][c];
                    if (cell.value.length !== 1) {
                        isDone = false;
                    }
                    this.cells[r][c].resetErrorCount();
                }
            }

            // 1) validate all rows
            for (var r = 0; r < 9; r++) {
                hasDuplicates = hasDuplicates || this._checkDuplicate(r, r, 0, 8);
            }

            // 2) validate all columns
            for (var c = 0; c < 9; c++) {
                hasDuplicates = hasDuplicates || this._checkDuplicate(0, 8, c, c);
            }

            // 3) validateAllColumns
            for (var i = 0; i < 3; i++) {
                var minRow = i*3;
                for (var j = 0; j < 3; j++) {
                    var minCol = j*3;
                    hasDuplicates = hasDuplicates || this._checkDuplicate(minRow, minRow+2, minCol, minCol+2);
                }
            }

            if (isDone && !hasDuplicates) {
                // TODO show done message
            }
        },

        _checkDuplicate: function(minR, maxR, minC, maxC) {
            var cells = []
            var currentValues = [];
            var hasDuplicates = false;
            for (var r = minR; r <= maxR; r++) {
                for (var c = minC; c <= maxC; c++) {
                    var cell = this.cells[r][c];
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
            };
            return hasDuplicates;
        }
    });

    return Grid;
});
