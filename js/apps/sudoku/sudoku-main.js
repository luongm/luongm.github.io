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
        this.startTime = this.getCurrentTime();
    };

    _.extend(SudokuApp.prototype, {
        template: Templates.sudokuMainTemplate,

        render: function() {
            var app = this;
            this.$el.html(this.template());
            this.sudokuGrid = new Grid({
                el: this.$el.find("table#sudoku-grid"),
                board: this.board,
                onDoneCallback: function() {
                    var successOverlayMessage = $(Templates.overlayMessageTemplate({
                        containerId: "solved-success",
                        message: 'Congratulations, you\'ve finished this board in '
                            + app.printGameDuration(app.getCurrentTime() - app.startTime)
                            + '. Thank you for playing!',
                        buttonClass: "success",
                        buttonText: 'No I want to use the sucky landscape mode'
                    })).css('display', 'table'); // to make the message vertically centered
                    app.$el.append(successOverlayMessage);

                    //
                    successOverlayMessage.find("button.success").click(function() {
                        // keep the overlay there so the user cannot change the board anymore
                        successOverlayMessage.addClass("dismissed").empty();
                    });
                }
            });
            this.sudokuGrid.render();

            // generate warning message for landscape orientation
            var warningMessage = $(Templates.overlayMessageTemplate({
                containerId: "orientation-warning",
                message: 'Please turn your phone portrait for the best experience.',
                buttonClass: "warning",
                buttonText: 'No I want to use the sucky landscape mode'
            }));
            this.$el.append(warningMessage);

            // prompt for hiding warning message
            warningMessage.find("button.warning").click(function() {
                warningMessage.hide();
            });

            return this;
        },

        /**
         * return the pretty format of duration, ie. 2 seconds or 5 minutes and 1 second
         */
        printGameDuration: function(duration) {
            var days = Math.round(duration / (24 * 3600));
            var hours = Math.round(duration / 3600);
            var minutes = Math.round(duration / 60);
            var seconds = duration % 60;
            var timeVals = [days, hours, minutes, seconds];

            var found = 0;
            for (var i = 0; i < timeVals.length; i++) {
                if (found == 2) {
                    // only show 2 biggest time denominations
                    timeVals[i] = 0;
                }
                if (timeVals[i] != 0) {
                    found++;
                }
            }
            return [(timeVals[0] == 0 ? '' : timeVals[0] + " day" + (timeVals[0] > 1 ? 's' : '')),
                (timeVals[1] == 0 ? '' : timeVals[1] + " hour" + (timeVals[1] > 1 ? 's' : '')),
                (timeVals[2] == 0 ? '' : timeVals[2] + " minute" + (timeVals[2] > 1 ? 's' : '')),
                (timeVals[3] == 0 ? '' : timeVals[3] + " second" + (timeVals[3] > 1 ? 's' : ''))].join(" ");
        },

        getCurrentTime: function() {
            return Math.round(new Date().getTime()/1000);
        }
    });

    // Exports
    return SudokuApp;
});
