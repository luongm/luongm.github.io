/** Templates **/
define(function(require) {
    var _ = require("underscore");

    var Templates = {
        // template of the whole sudoku app
        sudokuMainTemplate: _.template('\
            <table id="sudoku-grid"></table>\
            <!-- orientation warning message --%>\
            <div id="orientation-warning">\
                <div id="message">\
                    Please turn your phone portrait for the best experience.\
                    <br>\
                    <button class="warning-ignored">\
                        No I want to use the sucky landscape mode\
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
            <td class="row<%= row %> col<%= col %> fixed" data-row="<%= row %>" data-col="<%= col %>" tabindex="<%= tabIndex %>">\
                <%= num %>\
            </td>\
        ')
    };

    // Exports
    return Templates;
});
