var AbstractField = require('./AbstractField');
var idService = require('../idService');

var DateTimeField = function(field) {
    AbstractField.call(this, field);
};

DateTimeField.prototype = Object.create(AbstractField.prototype);
DateTimeField.prototype.constructor = DateTimeField;

DateTimeField.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.name}</label>
    <input type="datetime-local" id="${id}" class="form-control" name="${this.name}">
</div>`;

    this.selector = `#${id}`;

    return html;
};

DateTimeField.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

DateTimeField.prototype.validate = function() {
    
};


module.exports = DateTimeField;