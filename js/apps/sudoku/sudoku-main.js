/**
 * Main logic of the problem
 */
define(function(require) {
    var $ = require("jquery"),
        _ = require("underscore"),
        Helpers = require("apps/sudoku/helpers"),
        Templates = require("apps/sudoku/templates");

    var SudokuApp = function(options) {
        this.board = options.board;
        this.$el = options.el;
    };

    _.extend(SudokuApp.prototype, {
        template: Templates.sudokuMainTemplate,

        /**
         * @params board: {Object} { 0: { 1: 4 } } -> [row 0, col 1] is 4
         */
        render: function() {
            this.$el.html(this.template());
            this.sudokuGrid = this.$el.find("table#sudoku-grid");
            this.warningMessage = this.$el.find("#orientation-warning");
            Helpers.generateSudokuTable(this.sudokuGrid, this.board);

            // prompt for hiding warning message
            this.warningMessage.find("button.warning-ignored").click(function() {
                this.warningMessage.hide();
            });
            return this;
        }
    });

    // Exports
    return SudokuApp;
});
