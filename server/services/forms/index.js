const formRepository = require('./schemas/index');
const {
    ADD_TEMPLATE, ADD_STANDARD_LINE, IS_MEMBER, ADD_MEMBER, SELECT_MEMBER, ADD_CORRESPONDENT, UPDATE_CORRESPONDENT,
    REMOVE_CORRESPONDENT, ADD_TOPIC, REMOVE_TOPIC, CREATE_CASE, CREATE_AND_ALLOCATE_CASE, BULK_CREATE_CASE,
    ADD_DOCUMENT, REMOVE_DOCUMENT, MANAGE_DOCUMENTS, MANAGE_PEOPLE, ADD_CONTRIBUTION, ADD_ADDITIONAL_CONTRIBUTION, EDIT_CONTRIBUTION
} = require('../actions/types');

const mpamContributionsRequest = {
    showBusinessUnits: true,
    primaryChoiceLabel: 'Business Area',
    primaryChoiceList: 'MPAM_CONTRIBUTION_BUSINESS_AREAS'
};

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
                COMP: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
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
                },
                MPAM: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                MTS: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                WCS: {
                    builder: formRepository.confirmCreateWcs,
                    action: CREATE_AND_ALLOCATE_CASE
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
                COMP: {
                    builder: formRepository.bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
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
                },
                MPAM: {
                    builder: formRepository.bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                MTS: {
                    builder: formRepository.bulkAddDocument,
                    action: BULK_CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                WCS: {
                    builder: formRepository.bulkAddDocument,
                    action: CREATE_CASE,
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
        PEOPLE: {
            MANAGE: {
                builder: formRepository.managePeople,
                action: MANAGE_PEOPLE
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
            ADDNOMP: {
                builder: formRepository.addCorrespondentDetails,
                action: ADD_CORRESPONDENT
            },
            DETAILS: {
                builder: formRepository.addCorrespondentDetails,
                action: ADD_CORRESPONDENT
            },
            UPDATE: {
                builder: formRepository.updateCorrespondentDetails,
                action: UPDATE_CORRESPONDENT
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
        },
        CONTRIBUTIONS: {
            MPAM: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: mpamContributionsRequest
                },
                ADDADDITIONALREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_ADDITIONAL_CONTRIBUTION,
                    customConfig: mpamContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: mpamContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: mpamContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: mpamContributionsRequest
                }
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
        const { action } = options;

        if (action) {
            const { entity, somuCaseType, somuType } = options;
            let formDefinition = undefined;
            if (entity) {
                formDefinition = formDefinitions['CASE'][entity.toUpperCase()][action.toUpperCase()];
            } else if (somuType && somuCaseType) {
                formDefinition = formDefinitions['CASE'][somuType.toUpperCase()][somuCaseType.toUpperCase()][action.toUpperCase()];
                options.customConfig = formDefinition.customConfig;
            }

            if (formDefinition) {
                const form = await formDefinition.builder.call(this, options);
                return { schema: form.schema, action: formDefinition.action, data: form.data };
            }
        } else {
            return undefined;
        }
    }
};
