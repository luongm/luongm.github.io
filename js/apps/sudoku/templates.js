/** Templates **/
define(function(require) {
    var _ = require("underscore");

    var Templates = {
        editableCellTemplate: _.template('\
            <td class="row<%= row %> col<%= col %> editable">\
                <input type="number">\
            </td>\
        '),

        fixedCellTemplate: _.template('\
            <td class="row<%= row %> col<%= col %> fixed">\
                <%= num %>\
            </td>\
        ')
    };

    // Exports
    return Templates;
});
