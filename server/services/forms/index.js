const caseCreate = require('./case-create.json');
const addDocument = require('./document-add.json');
const testForm = require('./case-test.json');
const { CREATE_CASE, CREATE_BULK_CASE, ADD_DOCUMENT } = require('../actions/types');

const workflowDefinitions = {
    // '/:workflow/:action'
    // or
    // /:workflow/:context/:action'
    ACTION: {
        CREATE: {
            requiredRole: 'CREATE_CASE',
            WORKFLOW: {
                schema: caseCreate,
                next: {
                    action: 'DOCUMENT',
                    context: {
                        field: 'case-type'
                    }
                }
            },
            DOCUMENT: {
                schema: addDocument,
                action: CREATE_CASE
            }
        },
        TEST: {
            requiredRole: 'TEST',
            FORM: {
                schema: testForm
            }
        },
        BULK: {
            requiredRole: 'BULK_CREATE_CASE',
            WORKFLOW: {
                schema: caseCreate,
                next: {
                    action: 'DOCUMENT',
                    context: {
                        field: 'case-type'
                    }
                }
            },
            DOCUMENT: {
                schema: addDocument,
                action: CREATE_BULK_CASE
            }
        }
    },
    // e.g /case/:caseId/:entity/:action
    CASE: { // CONTEXT
        DOCUMENT: { // Entity
            ADD: { // Action
                schema: addDocument,
                action: ADD_DOCUMENT
            }
        }
    },
    // e.g /case/:caseId/stage/:stageId
    // or
    // e.g /case/:caseId/stage/:stageId/:entity/:action
    STAGE: { // CONTEXT
        DOCUMENT: { // Entity
            ADD: { // Action
                schema: addDocument,
                action: ADD_DOCUMENT
            }
        }
    }
};

module.exports = {
    getForm: ({ context, workflow, action }) => {
        if (context && workflow && action) {
            try {
                const form = workflowDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()];
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