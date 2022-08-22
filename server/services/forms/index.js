const formRepository = require('./schemas/index');
const formDecorator = require('./schemas/decorators/form-decorator');

const {
    ADD_TEMPLATE, ADD_STANDARD_LINE, IS_MEMBER, ADD_MEMBER, SELECT_MEMBER, ADD_CORRESPONDENT, UPDATE_CORRESPONDENT,
    REMOVE_CORRESPONDENT, ADD_TOPIC, REMOVE_TOPIC, CREATE_CASE, CREATE_AND_ALLOCATE_CASE, BULK_CREATE_CASE,
    ADD_DOCUMENT, REMOVE_DOCUMENT, MANAGE_DOCUMENTS, MANAGE_PEOPLE, APPLY_CASE_DEADLINE_EXTENSION, CONFIRMATION_SUMMARY,
    ADD_CASE_APPEAL, EDIT_CASE_APPEAL, RECORD_INTEREST, UPDATE_INTEREST, ADD_APPEAL_DOCUMENT,SUSPEND_CASE, UNSUSPEND_CASE
} = require('../actions/types');

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
                BF2: {
                    builder: formRepository.escalateCase,
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
                POGR: {
                    builder: formRepository.addDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                POGR2: {
                    builder: formRepository.escalateCase,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    },
                    config: {
                        documentRequired: false,
                        documentLabel: 'Are there any documents to include?',
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
                },
                BF: {
                    builder: formRepository.bulkAddDocument,
                    action: CREATE_CASE,
                    next: {
                        action: 'CONFIRMATION_SUMMARY'
                    }
                },
                BF2: {
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
            },
            SUSPENSION: {
                ADD: {
                    builder: formRepository.suspendCase,
                    action: SUSPEND_CASE,
                    next: {
                        action: CONFIRMATION_SUMMARY
                    }
                },
                REMOVE: {
                    builder: formRepository.removeSuspension,
                    action: UNSUSPEND_CASE,
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

                let form = await formDefinition.builder.call(this, { data, config: formDefinition.config });
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
            const { entity, caseType, caseAction } = options;
            let formDefinition = undefined;
            if (entity && caseType) {
                formDefinition = formDefinitions['CASE'][entity.toUpperCase()][caseType][action.toUpperCase()];
            } else if (entity) {
                formDefinition = formDefinitions['CASE'][entity.toUpperCase()][action.toUpperCase()];
            }  else if (caseAction) {
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
