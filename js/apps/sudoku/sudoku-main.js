/**
 * Main logic of the problem
 */
define(function(require) {
    var $ = require("jquery"),
        _ = require("underscore"),
        Grid = require("apps/sudoku/grid"),
        Templates = require("apps/sudoku/templates");

    var SudokuApp = function(options) {
        this.board = options.board;
        this.$el = options.el;
        this.startTime = Math.round(new Date().getTime()/1000);
    };

    _.extend(SudokuApp.prototype, {
        template: Templates.sudokuMainTemplate,

        /**
         * @params board: {Object} { 0: { 1: 4 } } -> [row 0, col 1] is 4
         */
        render: function() {
            var app = this;
            this.$el.html(this.template());
            this.sudokuGrid = new Grid({
                el: this.$el.find("table#sudoku-grid"),
                board: this.board,
                onDoneCallback: function() {
                    app.successMessage.css('display', 'table'); // so the message can be centered
                }
            });
            this.sudokuGrid.render();

            // messages
            this.successMessage = this.$el.find("#solved-success");
            this.warningMessage = this.$el.find("#orientation-warning");

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
