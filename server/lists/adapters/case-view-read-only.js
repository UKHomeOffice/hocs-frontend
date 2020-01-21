const Form = require('../../services/forms/form-builder');

module.exports = async (template) => {
    return Form(template).withNoPrimaryAction().build();
};