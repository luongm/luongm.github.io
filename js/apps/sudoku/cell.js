define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        Templates = require("apps/sudoku/templates");

    var Cell = function(options) {
        this.r = options.r;
        this.c = options.c;
        this.num = options.num;

        // keep a reference to Helpers, since I can't import Helpers with requireJS
        //     because it will cause circular dependency
        this.Helpers = options.Helpers;

        // empty of '-' means editable
        this.isEditable = !this.num || this.num == "-";
        this.value = null;
    };

    /**
     * render the cell, depending on isEditable and also register listeners
     */
    Cell.prototype.render = function() {
        var templateToUse = this.isEditable
            ? Templates.editableCellTemplate
            : Templates.fixedCellTemplate;
        this.$el = $(templateToUse({
            row: this.r,
            col: this.c,
            tabIndex: this.r*9 + this.c + 1,
            num: this.num
        }));

        if (this.isEditable) {
            this.inputBox = this.$el.find("input[type=number]");
        }

        this.registerListeners();
        return this;
    };

    /**
     * register event handlers
     * - navigation within table via arrow and tab keys
     * - typing in input box if it's editable
     */
    Cell.prototype.registerListeners = function() {
        // navigating the grid
        var cell = this;
        cell.$el.on("keyup", function(event) {
            switch(event.which) {
                case 9: // tab
                case 37: // left
                case 38: // up
                case 39: // right
                case 40: // down
                    event.preventDefault();
                    break;
                default:
                    // default behavior
            }
        }).on("keydown", function(event) {
            switch(event.which) {
                case 9: // tab
                case 37: // left
                case 38: // up
                case 39: // right
                case 40: // down
                    event.preventDefault();
                    cell.navigate(event);
                    break;
                default:
                    // default behavior
            }
        }).on("click", function() {
            cell.toggleEditMode(true);
            cell.focus();
        });

        // if editable, add input listeners typing in inputs
        if (cell.isEditable) {
            cell.inputBox.on("blur", function() {
                cell.toggleEditMode(false);
            }).on("keydown", function(event) {
                if ((event.which >= 48 && event.which <= 57)
                        || (event.which >= 96 && event.which <= 105)) {
                    // this is numbers 0-9, default behavior
                    debugger;
                } else {
                    switch(event.which) {
                        case 8: // backspace
                        case 9: // tab
                        case 46: // delete
                            // let the cell's container handle these
                            break;
                        default:
                            // ignore non-numeric key strokes
                            event.preventDefault();
                    }
                }
            }).on("change", function() {
                debugger;
            });
        }
    };

    Cell.prototype.navigate = function(event) {
        var newRowIndex = this.r,
            newColIndex = this.c;
        switch(event.which) {
            case 9: // tab
                if (event.shiftKey) { // shift tab
                    newColIndex--;
                    if (newColIndex < 0) {
                        newColIndex = 8;
                        --newRowIndex < 0 && (newRowIndex = 8);
                    };
                } else {
                    newColIndex = (newColIndex+1) % 9;
                    if (newColIndex == 0) {
                        newRowIndex = (newRowIndex+1) % 9;
                    }
                }
                break;
            case 37: // left
                --newColIndex < 0 && (newColIndex = 8);
                break;
            case 38: // up
                --newRowIndex < 0 && (newRowIndex = 8); // up means lower row index first
                break;
            case 39: // right
                ++newColIndex > 8 && (newColIndex = 0);
                break;
            case 40: // down
                ++newRowIndex > 8 && (newRowIndex = 0); // down means high row index
                break;
        }
        var newCell = this.Helpers.cells[newRowIndex][newColIndex];
        this.toggleEditMode(false);
        newCell.toggleEditMode(true);
        newCell.focus();
    };

    Cell.prototype.toggleEditMode = function(mode) {
        this.$el.toggleClass("editing", mode);
    };

    Cell.prototype.focus = function() {
        // focus on the input if the cell is editable
        if (this.isEditable) {
            this.inputBox.focus();
        } else {
            this.$el.focus();
        }
    }

    Cell.prototype.destroy = function() {
        // TODO memory management
    }

    return Cell;
})
