/** Templates **/
define(function(require) {
    var _ = require("underscore");

    var Templates = {
        // template of the whole sudoku app
        sudokuMainTemplate: _.template('\
            <table id="sudoku-grid"></table>\
        '),

        overlayMessageTemplate: _.template('\
            <div id="<%= containerId %>" class="overlay-message-container">\
                <div class="message">\
                    <span>\
                        <%= message %>\
                    </span>\
                    <br>\
                    <button class="<%= buttonClass %>">\
                        <%= buttonText %>\
                    </button>\
                </div>\
            </div>\
        '),

        // each input is allowed 9 characters
        editableCellTemplate: _.template('\
            <td class="row<%= row %> col<%= col %> editable" data-row="<%= row %>" data-col="<%= col %>" tabindex=<%= tabIndex %>>\
                <input type="number" pattern="\\d*" />\
            </td>\
        '),

        fixedCellTemplate: _.template('\
            <td class="row<%= row %> col<%= col %> fixed" data-row="<%= row %>" data-col="<%= col %>">\
                <%= num %>\
            </td>\
        ')
    };

    // Exports
    return Templates;
});
