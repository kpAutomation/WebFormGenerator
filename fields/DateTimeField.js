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
    <label for="${id}">${this.labelName ? this.labelName : this.name}</label>
    <div style="position:relative">
        <input id="${id}" class="form-control datetime" name="${this.name}">
    </div>
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