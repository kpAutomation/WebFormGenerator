var AbstractField = require('./AbstractField');
var idService = require('../idService');

var DateField = function(field) {
    AbstractField.call(this, field);
};

DateField.prototype = Object.create(AbstractField.prototype);
DateField.prototype.constructor = DateField;

DateField.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.labelName ? this.labelName : this.name}</label>
    <input id="${id}" class="form-control date" name="${this.name}">
</div>`;

    this.selector = `#${id}`;

    return html;
};

DateField.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

DateField.prototype.validate = function() {
    
};


module.exports = DateField;