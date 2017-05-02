var AbstractField = require('./AbstractField');
var idService = require('../idService');

var FileUploadField = function(field) {
    AbstractField.call(this, field);
};

FileUploadField.prototype = Object.create(AbstractField.prototype);
FileUploadField.prototype.constructor = FileUploadField;

FileUploadField.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();
    var html = `<div class="form-group">
    <label for="${id}">${this.name}</label>
    <input type="file" id="${id}" class="form-control" name="${this.name}">
</div>`;

    this.selector = `#${id}`;

    return html;
};

FileUploadField.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }

    return `function() {
        return new Promise(function(resolve, reject) {
            var htmlElement = document.querySelector('${this.selector}');
            var file = htmlElement.files[0];
            return resolve(file);
        });
    }`;
};

FileUploadField.prototype.validate = function() {
    
};


module.exports = FileUploadField;