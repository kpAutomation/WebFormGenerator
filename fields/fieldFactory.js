var ShortAnswer = require('./ShortAnswer');
var Paragraph = require('./Paragraph');
var Currency = require('./Currency');
var Checkbox = require('./Checkbox');
var Dropdown = require('./Dropdown');
var DateField = require('./DateField');
var NumberField = require('./NumberField');
var DateTimeField = require('./DateTimeField');
var FileUploadField = require('./FileUploadField');
var RelationshipField = require('./RelationshipField');

var FieldFactory = function() {};

FieldFactory.prototype.createFormField = function(trackviaField) {
    var type = trackviaField.fieldMetaType;
    // console.log(trackviaField.name + ': ' + type);

    if (type === 'shortAnswer' || type === 'indentifier' || type === 'email') {
        return new ShortAnswer(trackviaField);
    }

    if (type === 'paragraph') {
        return new Paragraph(trackviaField);
    }

    if (type === 'currency') {
        return new Currency(trackviaField);
    }

    if (type === 'checkbox') {
        return new Checkbox(trackviaField);
    }

    if (type === 'dropDown') {
        return new Dropdown(trackviaField);
    }
    

    if (type === 'date') {
        return new DateField(trackviaField);
    }

    if (type === 'datetime') {
        return new DateTimeField(trackviaField);
    }

    if (type === 'image' || type === 'document') {
        return new FileUploadField(trackviaField);
    }

    if (type === 'number') {
        return new NumberField(trackviaField);
    }

    if (type === 'relationship') {
        return new RelationshipField(trackviaField);
    }
}



module.exports = new FieldFactory();