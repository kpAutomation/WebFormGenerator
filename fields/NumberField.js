var AbstractField = require('./AbstractField');
var idService = require('../idService');

var NumberField = function(field) {
    AbstractField.call(this, field);
};

NumberField.prototype = Object.create(AbstractField.prototype);
NumberField.prototype.constructor = NumberField;

NumberField.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.labelName ? this.labelName : this.name}</label>
    <input type="text" id="${id}" class="form-control" name="${this.name}">
</div>`;

    this.selector = `#${id}`;

    return html;
};

NumberField.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

NumberField.prototype.validate = function() {
    
};


module.exports = NumberField;