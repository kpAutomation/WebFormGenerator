var AbstractField = require('./AbstractField');
var idService = require('../idService');

var Currency = function(field) {
    AbstractField.call(this, field);
};

Currency.prototype = Object.create(AbstractField.prototype);
Currency.prototype.constructor = Currency;

Currency.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.labelName ? this.labelName : this.name}</label>
    <input type="text" id="${id}" class="form-control" name="${this.name}">
</div>`;

    this.selector = `input[name="${this.name}"]`;

    return html;
};

Currency.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

Currency.prototype.validate = function() {
    
};


module.exports = Currency;