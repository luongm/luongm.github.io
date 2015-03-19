define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        Templates = require("apps/sudoku/templates");
    var Helpers; // can't use requireJS for Helpers due to circular dependencies

    var Cell = function(options) {
        this.r = options.r;
        this.c = options.c;
        this.num = options.num;

        // keep a reference to Helpers, since I can't import Helpers with requireJS
        //     because it will cause circular dependency
        Helpers = options.Helpers;

        // empty of '-' means editable
        this.isEditable = !this.num || this.num == "-";
        this.value = this.isEditable ? "" : this.num;

        // for adding error class, 'error-[0-4]'
        this.errorCount = 0;
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
            var previousValue = cell.value;
            cell.inputBox.on("blur", function() {
                cell.toggleEditMode(false);
                cell.inputBox.trigger("change");
            }).on("keyup", function(event) {
                cell.inputBox.trigger("change");
            }).on("keydown", function(event) {
                if (!event.shiftKey
                     && ((event.which >= 48 && event.which <= 57)
                        || (event.which >= 96 && event.which <= 105))) {
                    // numbers and numpad 0-9 without Shift, default behavior
                } else {
                    switch(event.which) {
                        case 8: // backspace
                        case 9: // tab
                        case 46: // delete
                            // let the cell's container handle these
                            break;
                        case 82: // rCmd+R or Control+R
                            if (!event.ctrlKey && !event.metaKey) {
                                event.preventDefault();
                            }
                            break;
                        default:
                            // ignore non-numeric key strokes
                            event.preventDefault();
                    }
                }
            }).on("change", function() {
                var newVal = cell.inputBox.val();
                if (newVal != cell.previousValue) {
                    cell.previousValue = cell.value;
                    cell.value = newVal;
                    Helpers.validateInput(cell);
                    cell.togglePencilMode();
                }
            });
        }
    };

    /**
     * for now, just add class .pencil-note if user input more than one number
     */
    Cell.prototype.togglePencilMode = function() {
        this.inputBox.toggleClass("pencil-note", this.value.length > 1);
    }

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
        var newCell = Helpers.cells[newRowIndex][newColIndex];
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
    };

    Cell.prototype.resetErrorCount = function() {
        this.$el.removeClass('error-' + this.errorCount);
        this.errorCount = 0;
    }

    /**
     * increment count and update class name
     */
    Cell.prototype.incrementErrorCount = function() {
        var oldErrorCount = this.errorCount;
        this.errorCount++; // ++this.errorCount > 3 && (this.errorCount = 3);
        this.$el.removeClass('error-' + oldErrorCount);
        this.errorCount != 0 && this.$el.addClass('error-' + this.errorCount);
    }

    Cell.prototype.destroy = function() {
        // TODO memory management
    };

    return Cell;
})
