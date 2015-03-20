define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        Templates = require("apps/sudoku/templates");

    var Cell = function(options) {
        this.r = options.r;
        this.c = options.c;
        this.num = options.num;

        this.grid = options.grid;

        // empty of '-' means editable
        this.isEditable = !this.num || this.num == "-";
        this.value = this.isEditable ? "" : this.num;

        // for adding error class, 'error-[0-4]'
        this.errorCount = 0;
    };

    _.extend(Cell.prototype, {
        /**
         * render the cell, depending on isEditable and also register listeners
         */
        render: function() {
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
        },

        /**
         * register event handlers
         * - navigation within table via arrow and tab keys
         * - typing in input box if it's editable
         */
        registerListeners: function() {
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
                cell.focus();
            });

            // if editable, add input listeners typing in inputs
            if (cell.isEditable) {
                var previousValue = cell.value;
                cell.inputBox.on("blur", function() {
                    cell.blur();
                    if (!cell.grid.solved) {
                        cell.inputBox.trigger("change");
                    }
                }).on("keyup", function() {
                    cell.inputBox.trigger("change");
                }).on("keydown", function(event) {
                    if (!event.shiftKey
                         && ((event.which >= 49 && event.which <= 57)
                            || (event.which >= 97 && event.which <= 105))) {
                        // numbers and numpad 1-9 without Shift allowed

                        // actual number
                        var value = event.which <= 57 ? event.which - 48 : event.which - 96;
                        if (cell.value.indexOf(value+"") >= 0) {
                            // don't allow user to enter the same number in the same box again
                            event.preventDefault();
                        } else if (cell.value.length >= 3) {
                            // can only have note of 3 distinct numbers
                            event.preventDefault();
                        } else {
                            cell.inputBox.trigger("change");
                        }
                    } else {
                        switch(event.which) {
                            case 8: // backspace
                            case 9: // tab
                            case 46: // delete
                                // let the cell's container handle these
                                cell.inputBox.trigger("change");
                                break;

                            // allow these keys if combined with Command or Control
                            case 65: // a; for select all
                            case 82: // r; for refresh
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
                        cell.togglePencilMode();

                        cell.grid.validateInput(cell);
                        cell.grid.saveToCookie();
                    }
                });
            }
        },

        setValue: function(value) {
            if (this.isEditable) {
                this.previousValue = this.value;
                this.value = value;
                this.inputBox.val(this.value);
                this.togglePencilMode();
            }
        },

        /**
         * for now, just add class .pencil-note if user input more than one number
         */
        togglePencilMode: function() {
            this.inputBox.toggleClass("pencil-note", this.value.length > 1);
        },

        navigate: function(event) {
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
            var newCell = this.grid.cells[newRowIndex][newColIndex];
            this.blur();
            newCell.focus();
        },

        toggleEditMode: function(mode) {
            this.$el.toggleClass("editing", mode);
        },

        focus: function() {
            this.toggleEditMode(true);
            // focus on the input if the cell is editable
            if (this.isEditable) {
                this.inputBox.focus();
            } else {
                this.$el.focus();
            }
        },

        blur: function() { // triggered from the input cell
            this.toggleEditMode(false);
            // focus on the input if the cell is editable
            this.$el.blur();
        },

        resetErrorCount: function() {
            this.$el.removeClass('error error-' + this.errorCount);
            this.errorCount = 0;
        },

        /**
         * increment count and update class name
         */
        incrementErrorCount: function() {
            var oldErrorCount = this.errorCount;
            this.errorCount++; // ++this.errorCount > 3 && (this.errorCount = 3);
            this.$el.removeClass('error-' + oldErrorCount);
            this.errorCount != 0 && this.$el.addClass('error error-' + this.errorCount);
        }
    });

    return Cell;
})
