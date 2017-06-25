var AbstractField = require('./AbstractField');
var idService = require('../idService');

var RelationshipField = function(field) {
    AbstractField.call(this, field);
};

RelationshipField.prototype = Object.create(AbstractField.prototype);
RelationshipField.prototype.constructor = RelationshipField;

RelationshipField.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.labelName ? this.labelName : this.name}</label>
    <select type="text" id="${id}" class="form-control" name="${this.name}"><option value=""></option></select>
</div>`;

    this.selector = `#${id}`;

    return html;
};

RelationshipField.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `$('${this.selector}').val()`;
};

RelationshipField.prototype.validate = function() {
    
};


module.exports = RelationshipField;