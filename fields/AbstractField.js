var AbstractField = function(field) {
    this.name = field.name;
    this.labelName = field.labelName;
    this.type = field.fieldMetaType;
    this.required = field.required;
    this.unique = field.unique;
    this.canRead = field.canRead;
    this.relatedTableId = field.relatedTableId;
    this.relatedViewId = (field.relationships && field.relationships[0]) ? field.relationships[0].viewId : null;
    // this.canUpdate = field.canUpdate;
    // this.canCreate = field.canCreate;
    this.readOnly = field.readOnly;
    this.choices = field.choices;
};

AbstractField.prototype.generateHTML = function() {
    throw new Error('Must implement abstract method generateHTML');
};

AbstractField.prototype.getValue = function() {
    throw new Error('Must implement abstract method getValue');
};

AbstractField.prototype.validate = function() {
    throw new Error('Must implement abstract method validate');
};

module.exports = AbstractField;