const caseCreate = require('./case-create.json');
const addDocument = require('./document-add.json');
const addDTENDocument = require('./dten-document-add.json');
const bulkCaseCreate = require('./bulk-case-create.json');
const bulkAddDocument = require('./bulk-document-add.json');
const testForm = require('./case-test.json');
const { CREATE_CASE, BULK_CREATE_CASE, ADD_DOCUMENT } = require('../actions/types');


const workflowDefinitions = {
    ACTION: {
        CREATE: {
            requiredRole: CREATE_CASE,
            WORKFLOW: {
                schema: caseCreate,
                next: {
                    action: 'DOCUMENT',
                    context: {
                        field: 'case-type'
                    }
                }
            },
            /** I see this as temp code, we should move this to a getCreateForType method in the list/workflow service **/
            DOCUMENT: {
                MIN : {
                    schema: addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO : {
                    schema: addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                DTEN : {
                    schema: addDTENDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                }
            }
        },
        TEST: {
            requiredRole: 'TEST',
            FORM: {
                schema: testForm
            }
        },
        BULK: {
            requiredRole: BULK_CREATE_CASE,
            WORKFLOW: {
                schema: bulkCaseCreate,
                next: {
                    action: 'DOCUMENT',
                    context: {
                        field: 'case-type'
                    }
                }
            },
            DOCUMENT: {
                MIN : {
                    schema: bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO : {
                    schema: bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                }
            }
        }
    },
    CASE: {
        DOCUMENT: {
            ADD: {
                schema: addDocument,
                action: ADD_DOCUMENT
            }
        }
    },
    STAGE: {
        DOCUMENT: {
            ADD: {
                schema: addDocument,
                action: ADD_DOCUMENT
            }
        }
    }
};

module.exports = {
    getForm: ({ context, workflow, action, entity }) => {
        if (context && workflow && action) {
            try {
                let form;
                if(action === 'DOCUMENT' || action == 'BULK_CREATE_CASE') {
                    form = workflowDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
                } else {
                    form = workflowDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()];
                }

                const requiredRole = workflowDefinitions[context.toUpperCase()][workflow.toUpperCase()].requiredRole;
                return JSON.parse(JSON.stringify({ ...form, requiredRole }));
            } catch (e) {
                throw new ReferenceError(`Unable to retrieve schema: ${e.message}`);
            }
        } else {
            throw new ReferenceError('Unable to retrieve schema: incorrect parameters');
        }

    }
};