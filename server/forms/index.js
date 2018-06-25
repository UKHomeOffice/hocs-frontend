const caseCreate = require('./case-create.json');
const testForm = require('./document-add.json');

const forms = {
    caseCreate: caseCreate,
    testForm: testForm
};

module.exports = {
    getForm: (form) => JSON.parse(JSON.stringify(forms[form]))
};