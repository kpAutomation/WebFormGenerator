var AbstractField = require('./AbstractField');
var idService = require('../idService');

var Dropdown = function(field) {
    AbstractField.call(this, field);
};

Dropdown.prototype = Object.create(AbstractField.prototype);
Dropdown.prototype.constructor = Dropdown;

Dropdown.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }


    var options = '';
    this.choices.forEach(function(choice) {
        options += `<option value="${choice}">${choice}</option>`;
    });
    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.labelName ? this.labelName : this.name}</label>
    <select id="${id}" class="form-control" name="${this.name}"><option value=""></option>${options}</select>
</div>`;

    this.selector = `#${id}`;

    return html;
};

Dropdown.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

Dropdown.prototype.validate = function() {
    
};


module.exports = Dropdown;