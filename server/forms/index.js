const caseCreate = require('./case-create.json');
const addDocument = require('./document-add.json');
const testForm = require('./case-test.json');

const forms = {
    caseCreate: caseCreate,
    addDocument: addDocument,
    testForm: testForm
};

module.exports = {
    getForm: (form) => {
        if (typeof forms[forms] === 'undefined') {
            throw new ReferenceError(`Form ${form} does not exist`);
        }
        return JSON.parse(JSON.stringify(forms[form]));
    }
};