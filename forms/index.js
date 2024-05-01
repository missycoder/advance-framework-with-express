// import in caolan forms
<<<<<<< HEAD
const forms = require("forms");
=======
const forms = require('forms');

>>>>>>> ecf1a2a (updated 04)
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

<<<<<<< HEAD
module.exports = { createProductForm, }
=======

// create a function that will
// create a form object
const createProductForm = () => {
    // the object in the parameter
    // is the form definition
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
        }),
        'cost': fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.min(0), validators.integer()]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true
        })
    })
}

module.exports = { createProductForm , bootstrapField};
>>>>>>> ecf1a2a (updated 04)
