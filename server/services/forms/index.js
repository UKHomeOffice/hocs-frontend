const formRepository = require('./schemas/index');
const formDecorator = require('./schemas/decorators/form-decorator');

const {
    ADD_TEMPLATE, ADD_STANDARD_LINE, IS_MEMBER, ADD_MEMBER, SELECT_MEMBER, ADD_CORRESPONDENT, UPDATE_CORRESPONDENT,
    REMOVE_CORRESPONDENT, ADD_TOPIC, REMOVE_TOPIC, CREATE_CASE, CREATE_AND_ALLOCATE_CASE, BULK_CREATE_CASE,
    ADD_DOCUMENT, REMOVE_DOCUMENT, MANAGE_DOCUMENTS, MANAGE_PEOPLE, ADD_CONTRIBUTION, ADD_ADDITIONAL_CONTRIBUTION,
    EDIT_CONTRIBUTION, APPLY_CASE_DEADLINE_EXTENSION, CONFIRMATION_SUMMARY, ADD_CASE_APPEAL, EDIT_CASE_APPEAL,
    ADD_APPROVAL_REQUEST, EDIT_APPROVAL_REQUEST, RECORD_INTEREST, UPDATE_INTEREST, ADD_APPEAL_DOCUMENT
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

const smcComplainantContributionsRequest = {
    showBusinessUnits: false,
    primaryChoiceLabel: 'Contributions Type',
    primaryChoiceList: 'S_COMP_CONTRIB_TYPE',
    showContributionAmount: false
};

const smcBusinessContributionsRequest = {
    showBusinessUnits: false,
    primaryChoiceLabel: 'Business Area',
    primaryChoiceList: 'S_COMP_CONTRIB_BUS_AREA',
    showContributionAmount: false
};

const bfBusinessContributionsRequest = {
    showBusinessUnits: false,
    primaryChoiceLabel: 'Business Area',
    primaryChoiceList: 'S_BF_CONTRIB_BUS_AREA',
    showContributionAmount: false
};

const toContributionsRequest = {
    showBusinessUnits: true,
    primaryChoiceLabel: 'Business Area',
    primaryChoiceList: 'MPAM_CONTRIBUTION_BUSINESS_AREAS'
};

const bfComplainantContributionsRequest = {
    showBusinessUnits: false,
    primaryChoiceLabel: 'Contributions Type',
    primaryChoiceList: 'S_BF_CONTRIB_TYPE'
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
                SMC: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                IEDET: {
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
                },
                FOI: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                BF: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                TO: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
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
                COMP2: {
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
        CASE_ACTION: {
            EXTENSION: {
                ADD: {
                    builder: formRepository.confirmExtendDeadlineFoi,
                    action: APPLY_CASE_DEADLINE_EXTENSION,
                    next: {
                        action: CONFIRMATION_SUMMARY
                    }
                }
            },
            APPEAL: {
                ADD: {
                    builder: formRepository.recordAppealFoi,
                    action: ADD_CASE_APPEAL,
                    next: {
                        action: CONFIRMATION_SUMMARY
                    }
                },
                ADD_DOCUMENT: {
                    builder: formRepository.addAppealDocument,
                    action: ADD_APPEAL_DOCUMENT,
                    next: {
                        action: CONFIRMATION_SUMMARY
                    }
                },
                UPDATE: {
                    builder: formRepository.updateAppealFoi,
                    action: EDIT_CASE_APPEAL,
                    next: {
                        action: CONFIRMATION_SUMMARY
                    }
                }
            },
            RECORD_INTEREST: {
                ADD: {
                    builder: formRepository.recordInterest,
                    action: RECORD_INTEREST,
                    next: {
                        action: CONFIRMATION_SUMMARY
                    }
                },
                UPDATE: {
                    builder: formRepository.updateInterest,
                    action: UPDATE_INTEREST,
                    next: {
                        action: CONFIRMATION_SUMMARY
                    }
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
            },
            // overrides for specific case types
            FOI: {
                UPDATE: {
                    builder: formRepository.updateCorrespondentDetailsFoi,
                    action: UPDATE_CORRESPONDENT
                }
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
            TO: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: toContributionsRequest
                },
                ADDADDITIONALREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_ADDITIONAL_CONTRIBUTION,
                    customConfig: toContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: toContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: toContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: toContributionsRequest
                }
            },
        },
        APPROVAL_REQS: {
            FOI: {
                ADDREQUEST: {
                    builder: formRepository.approvalRequestFoi,
                    action: ADD_APPROVAL_REQUEST
                },
                EDITREQUEST: {
                    builder: formRepository.approvalRequestFoi,
                    action: EDIT_APPROVAL_REQUEST
                },
                VIEWREQUEST: {
                    builder: formRepository.approvalRequestFoi,
                },
                EDIT: {
                    builder: formRepository.approvalFulfillmentFoi,
                    action: EDIT_APPROVAL_REQUEST
                }
            },
        },
        COMPLAINANT_CONTRIB: {
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
            },
            COMP2: {
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
            },
            COMP2: {
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
            },
            BF: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: bfBusinessContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: bfBusinessContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: bfBusinessContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: bfBusinessContributionsRequest
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
            COMP2: {
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
        },
        SMC_COMP_CONTRIB: {
            SMC: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: smcComplainantContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: smcComplainantContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: smcComplainantContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: smcComplainantContributionsRequest
                }
            }
        },
        SMC_BUS_CONTRIB: {
            SMC: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: smcBusinessContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: smcBusinessContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: smcBusinessContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: smcBusinessContributionsRequest
                }
            }
        },
        BF_CONTRIB: {
            BF: {
                ADDREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: ADD_CONTRIBUTION,
                    customConfig: bfComplainantContributionsRequest
                },
                EDITREQUEST: {
                    builder: formRepository.contributionRequest,
                    action: EDIT_CONTRIBUTION,
                    customConfig: bfComplainantContributionsRequest
                },
                VIEWREQUEST: {
                    builder: formRepository.contributionRequest,
                    customConfig: bfComplainantContributionsRequest
                },
                EDIT: {
                    builder: formRepository.contributionFulfillment,
                    action: EDIT_CONTRIBUTION,
                    customConfig: bfComplainantContributionsRequest
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

                let form = await formDefinition.builder.call(this, { data });
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
        const { action, caseActionType } = options;

        if (action || caseActionType) {
            const { entity, somuCaseType, somuType, caseType, caseAction } = options;
            let formDefinition = undefined;
            if (entity && caseType) {
                formDefinition = formDefinitions['CASE'][entity.toUpperCase()][caseType][action.toUpperCase()];
            } else if (entity) {
                formDefinition = formDefinitions['CASE'][entity.toUpperCase()][action.toUpperCase()];
            } else if (somuType && somuCaseType) {
                formDefinition = formDefinitions['CASE'][somuType.toUpperCase()][somuCaseType.toUpperCase()][action.toUpperCase()];
                options.customConfig = formDefinition.customConfig;
            } else if (caseAction) {
                formDefinition = formDefinitions['CASE']['CASE_ACTION'][caseActionType.toUpperCase()][caseAction.toUpperCase()];
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
