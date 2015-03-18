/** Templates **/
define(function(require) {
    var _ = require("underscore");

    var Templates = {
        // each input is allowed 9 characters
        editableCellTemplate: _.template('\
            <td class="row<%= row %> col<%= col %> editable" data-row="<%= row %>" data-col="<%= col %>" tabindex=<%= tabIndex %>>\
                <input type="number" pattern="\d*">\
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
