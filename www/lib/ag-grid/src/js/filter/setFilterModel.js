var utils = require('../utils');

function SetFilterModel(colDef, rowModel, valueGetter) {
    this.colDef = colDef;
    this.rowModel = rowModel;
    this.valueGetter = valueGetter;

    this.createUniqueValues();

    // by default, no filter, so we display everything
    this.displayedValues = this.uniqueValues;
    this.miniFilter = null;
    //we use a map rather than an array for the selected values as the lookup
    //for a map is much faster than the lookup for an array, especially when
    //the length of the array is thousands of records long
    this.selectedValuesMap = {};
    this.selectEverything();
}

SetFilterModel.prototype.refreshUniqueValues = function(keepSelection) {
    this.createUniqueValues();

    var oldModel = Object.keys(this.selectedValuesMap);

    this.selectedValuesMap = {};
    this.filterDisplayedValues();

    if (keepSelection) {
        this.setModel(oldModel);
    } else {
        this.selectEverything();
    }
};

SetFilterModel.prototype.createUniqueValues = function() {
    if (this.colDef.filterParams && this.colDef.filterParams.values) {
        this.uniqueValues = utils.toStrings(this.colDef.filterParams.values);
    } else {
        this.uniqueValues = utils.toStrings(this.iterateThroughNodesForValues());
    }

    var bla = '';
    this.uniqueValues.forEach( function(item) {
        bla += '\'' + item + '\','
    });
    console.log(bla);

    if (this.colDef.comparator) {
        this.uniqueValues.sort(this.colDef.comparator);
    } else {
        this.uniqueValues.sort(utils.defaultComparator);
    }
};

SetFilterModel.prototype.iterateThroughNodesForValues = function() {
    var uniqueCheck = {};
    var result = [];

    var that = this;

    function recursivelyProcess(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.group && !node.footer) {
                // group node, so dig deeper
                recursivelyProcess(node.children);
            } else {
                var value = that.valueGetter(node);
                if (value === "" || value === undefined) {
                    value = null;
                }
                if (!uniqueCheck.hasOwnProperty(value)) {
                    result.push(value);
                    uniqueCheck[value] = 1;
                }
            }
        }
    }

    var topLevelNodes = this.rowModel.getTopLevelNodes();
    recursivelyProcess(topLevelNodes);

    return result;
};

//sets mini filter. returns true if it changed from last value, otherwise false
SetFilterModel.prototype.setMiniFilter = function(newMiniFilter) {
    newMiniFilter = utils.makeNull(newMiniFilter);
    if (this.miniFilter === newMiniFilter) {
        //do nothing if filter has not changed
        return false;
    }
    this.miniFilter = newMiniFilter;
    this.filterDisplayedValues();
    return true;
};

SetFilterModel.prototype.getMiniFilter = function() {
    return this.miniFilter;
};

SetFilterModel.prototype.filterDisplayedValues = function() {
    // if no filter, just use the unique values
    if (this.miniFilter === null) {
        this.displayedValues = this.uniqueValues;
        return;
    }

    // if filter present, we filter down the list
    this.displayedValues = [];
    var miniFilterUpperCase = this.miniFilter.toUpperCase();
    for (var i = 0, l = this.uniqueValues.length; i < l; i++) {
        var uniqueValue = this.uniqueValues[i];
        if (uniqueValue !== null && uniqueValue.toString().toUpperCase().indexOf(miniFilterUpperCase) >= 0) {
            this.displayedValues.push(uniqueValue);
        }
    }

};

SetFilterModel.prototype.getDisplayedValueCount = function() {
    return this.displayedValues.length;
};

SetFilterModel.prototype.getDisplayedValue = function(index) {
    return this.displayedValues[index];
};

SetFilterModel.prototype.selectEverything = function() {
    var count = this.uniqueValues.length;
    for (var i = 0; i < count; i++) {
        var value = this.uniqueValues[i];
        this.selectedValuesMap[value] = null;
    }
    this.selectedValuesCount = count;
};

SetFilterModel.prototype.isFilterActive = function() {
    return this.uniqueValues.length !== this.selectedValuesCount;
};

SetFilterModel.prototype.selectNothing = function() {
    this.selectedValuesMap = {};
    this.selectedValuesCount = 0;
};

SetFilterModel.prototype.getUniqueValueCount = function() {
    return this.uniqueValues.length;
};

SetFilterModel.prototype.getUniqueValue = function(index) {
    return this.uniqueValues[index];
};

SetFilterModel.prototype.unselectValue = function(value) {
    if (this.selectedValuesMap[value] !== undefined) {
        delete this.selectedValuesMap[value];
        this.selectedValuesCount--;
    }
};

SetFilterModel.prototype.selectValue = function(value) {
    if (this.selectedValuesMap[value] === undefined) {
        this.selectedValuesMap[value] = null;
        this.selectedValuesCount++;
    }
};

SetFilterModel.prototype.isValueSelected = function(value) {
    return this.selectedValuesMap[value] !== undefined;
};

SetFilterModel.prototype.isEverythingSelected = function() {
    return this.uniqueValues.length === this.selectedValuesCount;
};

SetFilterModel.prototype.isNothingSelected = function() {
    return this.uniqueValues.length === 0;
};

SetFilterModel.prototype.getModel = function() {
    if (!this.isFilterActive()) {
        return null;
    }
    var selectedValues = [];
    utils.iterateObject(this.selectedValuesMap, function(key) {
        selectedValues.push(key);
    });
    return selectedValues;
};

SetFilterModel.prototype.setModel = function(model) {
    if (model) {
        this.selectNothing();
        for (var i = 0; i<model.length; i++) {
            var newValue = model[i];
            if (this.uniqueValues.indexOf(newValue)>=0) {
                this.selectValue(model[i]);
            } else {
                console.warn('Value ' + newValue + ' is not a valid value for filter');
            }
        }
    } else {
        this.selectEverything();
    }
};

module.exports = SetFilterModel;
