var AbstractField = require('./AbstractField');
var idService = require('../idService');

var Checkbox = function(field) {
    AbstractField.call(this, field);
};

Checkbox.prototype = Object.create(AbstractField.prototype);
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.generateHTML = function() {
    if (this.readOnly) {
        return null;
    }

    var id = idService.getNext();   
    var checkboxes = '';
    var self = this;
    this.choices.forEach(function(choice) {
        checkboxes += `<div class="form-check"><label for="${id}">${choice}</label><input type="checkbox" name="${self.name}[]" value="${choice}"></div>`
    });

    var html = `<fieldset id="${id}" class="form-group">
    <legend>${this.name}</legend>
    ${checkboxes}
</fieldset>`;

    this.selector = `#${id}`;

    return html;
};

Checkbox.prototype.getValueHTML = function() {
    if (!this.selector) {
        return null;
    }
    
    var js = `
    (function(){
        var $fieldset = $('${this.selector}');
        var $checkedCheckboxes = $fieldset.find('input:checked');
        var checkedValues = $.map($checkedCheckboxes, function(checkbox) {
            console.log(checkbox);
            return $(checkbox).val();
        });

        return checkedValues;
    })()
`;

    return js;
};

Checkbox.prototype.validate = function() {
    
};


module.exports = Checkbox;