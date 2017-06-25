var AbstractField = require('./AbstractField');
var idService = require('../idService');

var Paragraph = function(field) {
    AbstractField.call(this, field);
};

Paragraph.prototype = Object.create(AbstractField.prototype);
Paragraph.prototype.constructor = Paragraph;

Paragraph.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.labelName ? this.labelName : this.name}</label>
    <textarea type="text" id="${id}" class="form-control" name="${this.name}"></textarea>
</div>`;

    this.selector = `textarea[name="${this.name}"]`;

    return html;
};

Paragraph.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

Paragraph.prototype.validate = function() {
    
};


module.exports = Paragraph;