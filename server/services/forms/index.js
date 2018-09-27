const caseCreate = require('./case-create.js');
const addCorrespondent = require('./add-correspondent.js');
const addMember = require('./add-member.js');
const addCorrespondentDetails = require('./add-correspondent-details.js');
const addMemberDetails = require('./add-member-details.js');
const removeCorrespondent = require('./remove-correspondent.js');
const addTopic = require('./add-topic.js');
const removeTopic = require('./remove-topic.js');
const addDocument = require('./document-add.js');
const addDocumentNew = require('./add-document.js');
const removeDocument = require('./remove-document.js');
const manageDocuments = require('./manage-documents.js');
const addDTENDocument = require('./dten-document-add.js');
const bulkCaseCreate = require('./bulk-case-create.js');
const bulkAddDocument = require('./bulk-document-add.js');
const testForm = require('./case-test.js');
const { IS_MEMBER, ADD_MEMBER, SELECT_MEMBER, ADD_CORRESPONDENT, REMOVE_CORRESPONDENT, ADD_TOPIC, REMOVE_TOPIC, CREATE_CASE, BULK_CREATE_CASE, ADD_DOCUMENT, REMOVE_DOCUMENT, MANAGE_DOCUMENTS } = require('../actions/types');


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
                MIN: {
                    schema: addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO: {
                    schema: addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                DTEN: {
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
                MIN: {
                    schema: bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO: {
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
                schema: addDocumentNew,
                action: ADD_DOCUMENT
            },
            REMOVE: {
                schema: removeDocument,
                action: REMOVE_DOCUMENT
            },
            MANAGE: {
                schema: manageDocuments,
                action: MANAGE_DOCUMENTS
            }
        },
        TOPIC: {
            ADD: {
                schema: addTopic,
                action: ADD_TOPIC
            },
            REMOVE: {
                schema: removeTopic,
                action: REMOVE_TOPIC
            }
        },
        CORRESPONDENT: {
            ADD: {
                schema: addCorrespondent,
                action: IS_MEMBER
            },
            DETAILS: {
                schema: addCorrespondentDetails,
                action: ADD_CORRESPONDENT
            },
            REMOVE: {
                schema: removeCorrespondent,
                action: REMOVE_CORRESPONDENT
            }
        },
        MEMBER: {
            ADD: {
                schema: addMember,
                action: SELECT_MEMBER
            },
            DETAILS: {
                schema: addMemberDetails,
                action: ADD_MEMBER
            }
        }
    }
};

module.exports = {
    getForm: ({ context, workflow, action, entity }) => {
        if (context && workflow && action) {
            try {
                let form;
                if (action === 'DOCUMENT' || action == 'BULK_CREATE_CASE') {
                    form = workflowDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
                } else {
                    form = workflowDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()];
                }

                const requiredRole = workflowDefinitions[context.toUpperCase()][workflow.toUpperCase()].requiredRole;
                return { schema: form.schema.call(this, {}), next: form.next, action: form.action, requiredRole };
            } catch (e) {
                throw new ReferenceError(`Unable to retrieve schema: ${e.message}`);
            }
        } else {
            throw new ReferenceError('Unable to retrieve schema: incorrect parameters');
        }
    },
    getFormForCase: async (options) => {
        let { entity, action } = options;
        if (entity && action) {
            let form;
            form = workflowDefinitions['CASE'][entity.toUpperCase()][action.toUpperCase()];
            return { schema: await form.schema.call(this, options), action: form.action, data: {} };
        }
    }
};