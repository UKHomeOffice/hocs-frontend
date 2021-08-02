const formRepository = require('./schemas/index');
const formDecorator = require('./schemas/decorators/form-decorator');
const {
    ADD_TEMPLATE, ADD_STANDARD_LINE, IS_MEMBER, ADD_MEMBER, SELECT_MEMBER, ADD_CORRESPONDENT, UPDATE_CORRESPONDENT,
    REMOVE_CORRESPONDENT, ADD_TOPIC, REMOVE_TOPIC, CREATE_CASE, CREATE_AND_ALLOCATE_CASE, BULK_CREATE_CASE,
    ADD_DOCUMENT, REMOVE_DOCUMENT, MANAGE_DOCUMENTS, MANAGE_PEOPLE, ADD_CONTRIBUTION, ADD_ADDITIONAL_CONTRIBUTION,
    EDIT_CONTRIBUTION, APPLY_CASE_DEADLINE_EXTENSION, CONFIRMATION_SUMMARY
} = require('../actions/types');

const mpamContributionsRequest = {
    showBusinessUnits: true,
    primaryChoiceLabel: 'Business Area',
    primaryChoiceList: 'MPAM_CONTRIBUTION_BUSINESS_AREAS'
};

const compBusinessContributionsRequest = {
    showBusinessUnits: false,
    primaryChoiceLabel: 'Business Area',
    primaryChoiceList: 'S_COMP_CONTRIB_BUS_AREA'
};

const compComplainantContributionsRequest = {
    showBusinessUnits: false,
    primaryChoiceLabel: 'Contributions Type',
    primaryChoiceList: 'S_COMP_CONTRIB_TYPE'
};

const exgratiaBusinessContributionsRequest = {
    showBusinessUnits: false,
    primaryChoiceLabel: 'Business Area Representative',
    primaryChoiceList: 'EX_GRATIA_BUS_REPS',
    showContributionAmount: true
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
                COMP2: {
                    builder: formRepository.escalateCase,
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
                },
                FOI: {
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
        ACTIONS_TAB: {
            EXTEND_FOI_DEADLINE: {
                builder: formRepository.confirmExtendDeadlineFoi,
                action: APPLY_CASE_DEADLINE_EXTENSION,
                next: {
                    action: CONFIRMATION_SUMMARY
                }
            }
        },
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
            },
            FOI: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequestFoi,
                    action: ADD_CONTRIBUTION
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequestFoi,
                    action: EDIT_CONTRIBUTION
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequestFoi,
                },
                EDIT: {
                    builder: formRepository.contributionFulfillmentFoi,
                    action: EDIT_CONTRIBUTION
                }
            },
        },
        APPROVAL_REQS: {
            FOI: {
                ADDREQUEST: {
                    builder: formRepository.approvalRequestFoi,
                    action: ADD_CONTRIBUTION
                },
                EDITREQUEST: {
                    builder: formRepository.approvalRequestFoi,
                    action: EDIT_CONTRIBUTION
                },
                VIEWREQUEST: {
                    builder: formRepository.approvalRequestFoi,
                },
                EDIT: {
                    builder: formRepository.approvalFulfillmentFoi,
                    action: EDIT_CONTRIBUTION
                }
            },
        },
        CCT_COMP_CONTRIB: {
            COMP: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: compComplainantContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: compComplainantContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: compComplainantContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: compComplainantContributionsRequest
                }
            }
        },
        CCT_BUS_CONTRIB: {
            COMP: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: compBusinessContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: compBusinessContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: compBusinessContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: compBusinessContributionsRequest
                }
            }
        },
        EXGRATIA_BUS_CONTRIB: {
            COMP: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: exgratiaBusinessContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: exgratiaBusinessContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: exgratiaBusinessContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: exgratiaBusinessContributionsRequest
                }
            },
            FOI: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequestFoi,
                    action: ADD_CONTRIBUTION
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequestFoi,
                    action: EDIT_CONTRIBUTION
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequestFoi,
                },
                EDIT: {
                    builder: formRepository.contributionFulfillmentFoi,
                    action: EDIT_CONTRIBUTION
                }
            }
        }
    }
};

module.exports = {
    getForm: async ({ context, workflow, action, entity, data }) => {
        if (context && workflow && action) {
            try {
                let formDefinition;
                let formEnrichmentKeys = { context, workflow, action, entity };
                if (action === 'DOCUMENT' || action == 'BULK_CREATE_CASE') {
                    formDefinition = formDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
                } else {
                    formDefinition = formDefinitions[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()];
                }

                let form = await formDefinition.builder.call(this, {});
                form = formDecorator.call(this, formEnrichmentKeys, form);

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
                return { schema: form.schema, action: formDefinition.action, data: form.data, next: formDefinition.next, };
            }
        } else {
            return undefined;
        }
    }
};
