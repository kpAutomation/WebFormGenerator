var AbstractField = require('./AbstractField');
var idService = require('../idService');

var ShortAnswer = function(field) {
    AbstractField.call(this, field);
};

ShortAnswer.prototype = Object.create(AbstractField.prototype);
ShortAnswer.prototype.constructor = ShortAnswer;

ShortAnswer.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.name}</label>
    <input type="text" id="${id}" class="form-control" name="${this.name}">
</div>`;

    this.selector = `#${id}`;

    return html;
};

ShortAnswer.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

ShortAnswer.prototype.validate = function() {
    
};


module.exports = ShortAnswer;