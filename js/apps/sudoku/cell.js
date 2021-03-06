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
                this.inputBox = this.$el.find("input");
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
            // NOTE: keyup and keydown are almost the same except keydown does the navigation
            //  this is because:
            //  - if both events handle navigation then it will be moved twice for every key the user hits
            //  - if only keyup handle it then user cannot hold the key to keep moving
            cell.$el.on("keyup", function(event) {
                switch(event.which) {
                    case 37: // left
                    case 39: // right
                    case 38: // up
                    case 40: // down
                        if (cell.isEditable && (event.ctrlKey || event.metaKey || event.shiftKey)) {
                            // allows user to select the input text
                            break;
                        }
                    case 9: // tab
                        event.preventDefault();
                        break;
                    default:
                        // default behavior
                }
            }).on("keydown", function(event) {
                var cursorIndex = event.target.selectionStart;
                switch(event.which) {
                    case 37: // left
                        if (cursorIndex == event.target.selectionEnd) {
                            if (cursorIndex > 0) {
                                break;
                            }
                        }
                    case 39: // right
                        if (cursorIndex == event.target.selectionEnd) {
                            // need to check event.which again because of the fallthrough from above
                            if (event.which == 39 && cursorIndex < cell.value.length) {
                                break;
                            }
                        }
                    case 38: // up
                    case 40: // down
                        if (cell.isEditable && (event.ctrlKey || event.metaKey || event.shiftKey)) {
                            // allows user to select the input text
                            break;
                        }
                    case 9: // tab
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
                        // allow numbers and numpad 1-9 without Shift

                        // actual number
                        var value = event.which <= 57 ? event.which - 48 : event.which - 96;

                        // valueToCheck is the true value of the cell right before insertion
                        //   ie. after delete the selected text to replace with the new input
                        var valueToCheck = cell.value;
                        if (event.target.selectionStart != event.target.selectionEnd) {
                            // user select part or all of the text, then type something
                            //   so before checking for duplicated or maxlength,
                            //   we need to remove the selected part of the text first
                            valueToCheck = cell.value.slice(0, event.target.selectionStart)
                                + cell.value.slice(event.target.selectionEnd, cell.value.length);
                        }

                        if (valueToCheck.indexOf(value+"") >= 0) {
                            // don't allow user to enter the same number in the same box again
                            event.preventDefault();
                        } else if (valueToCheck.length >= 3) {
                            // can only have note of 3 distinct numbers
                            event.preventDefault();
                        } else {
                            cell.inputBox.trigger("change");
                        }
                    } else {
                        switch(event.which) {
                            case 37: // left
                            case 39: // right
                            case 38: // up
                            case 40: // down
                                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                                    // user is selecting text -> default behavior
                                    break;
                                }
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
