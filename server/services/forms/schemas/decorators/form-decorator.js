const enrichmentDataFormFields = require('./form_decorations/schema-decorations');
const getLogger = require('../../../../libs/logger');

const checkForm = (form) => {
    return !form.schema || !form.schema.title;
};

module.exports = (keys,form) => {
    const logger = getLogger();
    logger.debug('GET_FORM_FIELD_DECORATIONS',{ ...keys });
    if (checkForm(form)) {
        logger.error('MALFORMED_DECORATION_REQUEST', { ...keys });
        throw new Error('Form for decoration missing or malformed.');
    }
    const { context, workflow, action, entity } = keys;
    const hasKeys = context && workflow && action && entity;
    let fieldsToAdd;
    if (hasKeys) {
        fieldsToAdd = enrichmentDataFormFields[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
    }
    if (!hasKeys || !fieldsToAdd) {
        logger.debug('NO_DECORATIONS_EXIST', { ...keys });
        return form;
    }
    return fieldsToAdd.add(form);
};


