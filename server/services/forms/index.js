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

const formDefinitions = {
    ACTION: {
        CREATE: {
            requiredRole: CREATE_CASE,
            WORKFLOW: {
                builder: caseCreate,
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
                    builder: addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO: {
                    builder: addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                DTEN: {
                    builder: addDTENDocument,
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
                builder: testForm
            }
        },
        BULK: {
            requiredRole: BULK_CREATE_CASE,
            WORKFLOW: {
                builder: bulkCaseCreate,
                next: {
                    action: 'DOCUMENT',
                    context: {
                        field: 'case-type'
                    }
                }
            },
            DOCUMENT: {
                MIN: {
                    builder: bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO: {
                    builder: bulkAddDocument,
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
                builder: addDocumentNew,
                action: ADD_DOCUMENT
            },
            REMOVE: {
                builder: removeDocument,
                action: REMOVE_DOCUMENT
            },
            MANAGE: {
                builder: manageDocuments,
                action: MANAGE_DOCUMENTS
            }
        },
        TOPIC: {
            ADD: {
                builder: addTopic,
                action: ADD_TOPIC
            },
            REMOVE: {
                builder: removeTopic,
                action: REMOVE_TOPIC
            }
        },
        CORRESPONDENT: {
            ADD: {
                builder: addCorrespondent,
                action: IS_MEMBER
            },
            DETAILS: {
                builder: addCorrespondentDetails,
                action: ADD_CORRESPONDENT
            },
            REMOVE: {
                builder: removeCorrespondent,
                action: REMOVE_CORRESPONDENT
            }
        },
        MEMBER: {
            ADD: {
                builder: addMember,
                action: SELECT_MEMBER
            },
            DETAILS: {
                builder: addMemberDetails,
                action: ADD_MEMBER
            }
        }
    }
};

module.exports = {
    getForm: async ({ context, workflow, action, entity }) => {
        if (context && workflow && action) {
            try {
                let formDefinition;
                if (action === 'DOCUMENT' || action == 'BULK_CREATE_CASE') {
                    formDefinition = formDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
                } else {
                    formDefinition = formDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()];
                }
                const requiredRole = formDefinitions[context.toUpperCase()][workflow.toUpperCase()].requiredRole;
                const form = await formDefinition.builder.call(this, {});
                return {
                    schema: form.schema,
                    next: formDefinition.next,
                    action: formDefinition.action,
                    requiredRole,
                    data: form.data
                };
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
            let formDefinition;
            formDefinition = formDefinitions['CASE'][entity.toUpperCase()][action.toUpperCase()];
            const form = await formDefinition.builder.call(this, options);
            return { schema: form.schema, action: formDefinition.action, data: form.data };
        }
    }
};