const formRepository = require('./schemas/index');
const { ADD_TEMPLATE, ADD_STANDARD_LINE, IS_MEMBER, ADD_MEMBER, SELECT_MEMBER, ADD_CORRESPONDENT, REMOVE_CORRESPONDENT, ADD_TOPIC, REMOVE_TOPIC, CREATE_CASE, BULK_CREATE_CASE, ADD_DOCUMENT, REMOVE_DOCUMENT, MANAGE_DOCUMENTS } = require('../actions/types');

const formDefinitions = {
    ACTION: {
        CREATE: {
            WORKFLOW: {
                builder: formRepository.caseCreate,
                next: {
                    action: 'DOCUMENT',
                    context: {
                        field: 'case-type'
                    }
                }
            },
            DOCUMENT: {
                MIN: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                DTEN: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                }
            }
        },
        TEST: {
            FORM: {
                builder: formRepository.testForm
            }
        },
        BULK: {
            WORKFLOW: {
                builder: formRepository.bulkCaseCreate,
                next: {
                    action: 'DOCUMENT',
                    context: {
                        field: 'case-type'
                    }
                }
            },
            DOCUMENT: {
                MIN: {
                    builder: formRepository.bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TRO: {
                    builder: formRepository.bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                DTEN: {
                    builder: formRepository.bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                }
            }
        },
        STANDARD_LINE: {
            ADD: {
                builder: formRepository.addStandardLine,
                action: ADD_STANDARD_LINE
            }
        },
        TEMPLATE: {
            ADD: {
                builder: formRepository.addTemplate,
                action: ADD_TEMPLATE
            }
        },
    },
    CASE: {
        DOCUMENT: {
            ADD: {
                builder: formRepository.addDocumentNew,
                action: ADD_DOCUMENT
            },
            REMOVE: {
                builder: formRepository.removeDocument,
                action: REMOVE_DOCUMENT
            },
            MANAGE: {
                builder: formRepository.manageDocuments,
                action: MANAGE_DOCUMENTS
            }
        },
        TOPIC: {
            ADD: {
                builder: formRepository.addTopic,
                action: ADD_TOPIC
            },
            REMOVE: {
                builder: formRepository.removeTopic,
                action: REMOVE_TOPIC
            }
        },
        CORRESPONDENT: {
            ADD: {
                builder: formRepository.addCorrespondent,
                action: IS_MEMBER
            },
            DETAILS: {
                builder: formRepository.addCorrespondentDetails,
                action: ADD_CORRESPONDENT
            },
            REMOVE: {
                builder: formRepository.removeCorrespondent,
                action: REMOVE_CORRESPONDENT
            }
        },
        MEMBER: {
            ADD: {
                builder: formRepository.addMember,
                action: SELECT_MEMBER
            },
            DETAILS: {
                builder: formRepository.addMemberDetails,
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
                const form = await formDefinition.builder.call(this, {});
                return {
                    schema: form.schema,
                    next: formDefinition.next,
                    action: formDefinition.action,
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