/** Templates **/
define(function(require) {
    var _ = require("underscore");

    var Templates = {
        editableCellTemplate: _.template('\
            <td class="row<%= row %> col<%= col %> editable" data-row="<%= row %>" data-col="<%= col %>" tabindex=<%= tabIndex %>>\
                <input type="number">\
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
