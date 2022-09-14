const { caseworkService, infoService, workflowService } = require('../clients/index');
const listService = require('../services/list');
const statics = require('./adapters/statics');
const caseTypeAdapter = require('./adapters/case-type');
const caseTypesAdapter = require('./adapters/case-types');
const caseTypeCommaSeparatedAdapter = require('./adapters/case-types-comma-separated');
const workstack = require('./adapters/workstacks');
const topicAdapter = require('./adapters/topics');
const activeTopicAdapter = require('./adapters/activeTopics');
const usersAdapter = require('./adapters/users');
const teamsAdapter = require('./adapters/teams');
const entityListItemsAdapter = require('./adapters/entityListItems');
const templatesAdapter = require('./adapters/templates');
const membersAdapter = require('./adapters/members');
const documentsAdapter = require('./adapters/documents');
const documentListAdapter = require('./adapters/documentList');
const documentTagsAdapter = require('./adapters/documentTags');
const countrySortAdapter = require('./adapters/countrySort');
const caseNoteAdapter = require('./adapters/case-notes');
const caseSummaryAdapter = require('./adapters/case-summary');
const caseActionDataAdapter = require('./adapters/case-action-data');
const caseActionLabelAdapter = require('./adapters/case-action-label');
const caseViewUnallocatedAdapter = require('./adapters/case-view-unallocated');
const caseDataAdapter = require('./adapters/case-data');
const {
    caseCorrespondentAdapter,
    correspondentTypeAdapter,
    caseCorrespondentsAllAdapter
} = require('./adapters/correspondents');
const { somuTypesAdapter, somuItemsAdapter } = require('./adapters/somu');

module.exports = {
    lists: {
        S_TEAMS: {
            client: 'INFO',
            endpoint: '/team',
            type: listService.types.STATIC,
            adapter: statics.teamsAdapter
        },
        S_ALL_TEAMS: {
            client: 'INFO',
            endpoint: '/team/all',
            type: listService.types.STATIC,
            adapter: statics.teamsAdapterAllTeams
        },
        S_USERS: {
            client: 'INFO',
            endpoint: '/users',
            type: listService.types.STATIC,
            adapter: statics.usersAdapter
        },
        S_CASETYPES: {
            client: 'INFO',
            endpoint: '/caseType',
            type: listService.types.STATIC,
            adapter: statics.caseTypesAdapter
        },
        S_STAGETYPES: {
            client: 'INFO',
            endpoint: '/stageType',
            type: listService.types.STATIC,
            adapter: statics.stageTypesAdapter
        },
        S_SYSTEM_CONFIGURATION: {
            client: 'INFO',
            endpoint: '/configuration',
            type: listService.types.STATIC
        },
        S_WCS_COHORTS: {
            client: 'INFO',
            endpoint: '/entity/list/WCS_COHORTS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_WCS_I_STATUS: {
            client: 'INFO',
            endpoint: '/entity/list/WCS_I_STATUS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_WCS_I_STATUS_OUTCOME: {
            client: 'INFO',
            endpoint: '/entity/list/WCS_I_STATUS_OUTCOME',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_WCS_ELIG_REJ_REASON: {
            client: 'INFO',
            endpoint: '/entity/list/WCS_ELIG_REJ_REASON',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_COMP_CCT_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_CCT_BUS_AREA',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_COMP_CCT_CASE_OUTCOME: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_CCT_CASE_OUTCOME',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_COMP_CCT_ENQ_REASON: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_CCT_ENQ_REASON',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        S_COMP_CSU_LIST: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_CSU_LIST',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_COMP_CONTRIB_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_CONTRIB_BUS_AREA',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_COMP_CONTRIB_TYPE: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_CONTRIB_TYPE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        COMP_IANDP_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_IANDP_BUS_AREA',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        COMP_RASI_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_RASI_BUS_AREA',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        COMP_VCIC_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_VCIC_BUS_AREA',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        COMP_VCOS_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_VCOS_BUS_AREA',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        COMP_OTHER_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_OTHER_BUS_AREA',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        COMP_EUSS_FP_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/COMP_EUSS_FP_BUS_AREA',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        S_BF_CONTRIB_TYPE: {
            client: 'INFO',
            endpoint: '/entity/list/BF_CONTRIB_TYPE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_IEDET_CSU_LIST: {
            client: 'INFO',
            endpoint: '/entity/list/IEDET_CSU_LIST',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_IEDET_CASE_OUTCOME: {
            client: 'INFO',
            endpoint: '/entity/list/IEDET_CASE_OUTCOME',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_IEDET_COMP_ORIGIN: {
            client: 'INFO',
            endpoint: '/entity/list/IEDET_COMP_ORIGIN',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_SUBJECTS: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_SUBJECTS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_ALL: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_ALL',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_PER: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_PER',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_GUI: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_GUI',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_DOC: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_DOC',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_TECH: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_TECH',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_DET: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_DET',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_HMPO: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_HMPO',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        MPAM_ENQUIRY_REASONS_OTHER: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_OTHER',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_ALL: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_ALL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        MPAM_CONTRIBUTION_BUSINESS_AREAS: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_CONTRIBUTION_BUSINESS_AREAS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_SMC_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/SMC_BUS_AREA',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_SMC_CSU_LIST: {
            client: 'INFO',
            endpoint: '/entity/list/SMC_CSU_LIST',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_CONTRIB_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/BF_CONTRIB_BUS_AREA',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_ALL_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_ALL_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_CASEWORK_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_CASEWORK_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_BORDER_FORCE_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_BORDER_FORCE_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_COMMUNICATIONS_DIRECTORATE_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_COMMUNICATIONS_DIRECTORATE_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_CORPORATE_ENABLERS_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_CORPORATE_ENABLERS_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_DDAT_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_DDAT_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_HMPO_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_HMPO_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_HOME_OFFICE_LEGAL_ADVISORS_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_HOME_OFFICE_LEGAL_ADVISORS_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_HOMELAND_SECURITY_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_HOMELAND_SECURITY_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_IMMIGRATION_ENFORCEMENT_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_IMMIGRATION_ENFORCEMENT_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_MIGRATION_AND_BORDERS_GROUP_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_MIGRATION_AND_BORDERS_GROUP_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_PRIVATE_OFFICE_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_PRIVATE_OFFICE_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_PUBLIC_SAFETY_GROUP_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_PUBLIC_SAFETY_GROUP_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_STARS_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_STARS_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_UKVI_RESP_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_UKVI_RESP_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_1: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_1',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_2: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_2',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_3: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_3',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_4: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_4',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_5: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_5',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_6: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_6',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_7: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_7',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_CAMPAIGNS: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_CAMPAIGNS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_MIN_SIGN_OFF_TEAMS: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_MIN_SIGN_OFF_TEAMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        MPAM_CAMPAIGNS: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_CAMPAIGNS',
            adapter: entityListItemsAdapter
        },
        CASE_TYPES: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=false',
            adapter: caseTypesAdapter
        },
        CASE_TYPES_BULK: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=true',
            adapter: caseTypesAdapter
        },
        CASE_TYPES_COMMA_SEPARATED_FOR_SEARCH: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=false&initialCaseType=false',
            adapter: caseTypeCommaSeparatedAdapter
        },
        CASE_TYPES_FOR_SEARCH: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=false&initialCaseType=false',
            adapter: caseTypesAdapter
        },
        COUNTRIES_CURRENT: {
            client: 'INFO',
            endpoint: '/country',
            adapter: countrySortAdapter
        },
        DASHBOARD: {
            client: 'CASEWORK',
            endpoint: '/dashboard',
            adapter: workstack.dashboardAdapter
        },
        USER_WORKSTACK: {
            client: 'CASEWORK',
            endpoint: '/stage/user/${userUuid}',
            adapter: workstack.userAdapter
        },
        TEAM_WORKSTACK: {
            client: 'CASEWORK',
            endpoint: '/stage/team/${teamId}',
            adapter: workstack.teamAdapter
        },
        WCS_CASEWORK_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=WCS_CASEWORK_TEAMS',
            adapter: teamsAdapter
        },
        WORKFLOW_WORKSTACK: {
            client: 'CASEWORK',
            endpoint: '/stage/team/${teamId}',
            adapter: workstack.workflowAdapter
        },
        STAGE_WORKSTACK: {
            client: 'CASEWORK',
            endpoint: '/stage/team/${teamId}',
            adapter: workstack.stageAdapter
        },
        DRAFT_TEAMS: {
            client: 'INFO',
            endpoint: '/team/stage/DCU_MIN_INITIAL_DRAFT',
            adapter: teamsAdapter
        },
        PRIVATE_OFFICE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=PRIVATE_OFFICE',
            adapter: teamsAdapter
        },
        MOVE_TEAM_OPTIONS: {
            client: 'INFO',
            endpoint: '/team/${teamId}/move_options',
            adapter: teamsAdapter
        },
        USERS_FOR_CASE: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/stage/${stageId}/team/members',
            adapter: usersAdapter
        },
        USERS_IN_TEAM: {
            client: 'INFO',
            endpoint: '/teams/${teamId}/members',
            adapter: usersAdapter
        },
        CASE_CORRESPONDENTS_ALL: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/correspondent',
            adapter: caseCorrespondentsAllAdapter
        },
        CASE_CORRESPONDENTS: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/correspondent',
            adapter: caseCorrespondentAdapter
        },
        CORRESPONDENT_TYPES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/correspondentType',
            adapter: correspondentTypeAdapter
        },
        SELECTABLE_CORRESPONDENT_TYPES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/correspondentType/selectable',
            adapter: correspondentTypeAdapter
        },
        TOPICS: {
            client: 'INFO',
            endpoint: '/topics',
            type: listService.types.DYNAMIC,
        },
        TOPICS_FOI: {
            client: 'INFO',
            endpoint: '/topics/FOI',
            adapter: activeTopicAdapter
        },
        TOPICS_USER: {
            client: 'INFO',
            endpoint: '/topics/MIN',
            adapter: topicAdapter
        },
        TOPICS_CASETYPE: {
            client: 'INFO',
            endpoint: '/case/${caseId}/topiclist',
            type: listService.types.DYNAMIC,
            adapter: topicAdapter
        },
        CASE_TOPICS: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/topic',
            adapter: (data) => data.topics
        },
        CASE_TEMPLATES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/templates',
            adapter: templatesAdapter,
            defaultValue: []
        },
        CASE_STANDARD_LINES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/standardLine',
            adapter: templatesAdapter,
            defaultValue: []
        },
        MEMBER_LIST: {
            client: 'INFO',
            endpoint: '/member',
            adapter: membersAdapter
        },
        CASE_DOCUMENT_LIST: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}',
            adapter: documentsAdapter
        },
        CASE_DOCUMENT_LIST_FINAL: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=FINAL',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_DRAFT: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=DRAFT',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_TO_DRAFT: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Initial%20Draft',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_FOI_DRAFT: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Draft%20response',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_FOI_INITIAL_RESPONSE: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Initial%20response',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_APPEAL_RESPONSE: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Appeal%20Response',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_ALL: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_FINAL_RESPONSE: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Final%20Response',
            adapter: documentListAdapter
        },
        // todo: this should be removed and updated to use the non tenant specific option above.
        CASE_DOCUMENT_LIST_FOI_FINAL_RESPONSE: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Final%20responses',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_INTERIM_LETTERS: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Interim%20Letter',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_POGR_DRAFT: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Draft',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_LIST_IEDET_FINAL_RESPONSE: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Final%20response',
            adapter: documentListAdapter
        },
        CASE_DOCUMENT_TAGS: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/documentTags',
            adapter: documentTagsAdapter
        },
        CASE_NOTES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/timeline',
            adapter: caseNoteAdapter
        },
        CASE_SUMMARY: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/summary',
            adapter: caseSummaryAdapter
        },
        CASE_DATA: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}',
            adapter: caseDataAdapter
        },
        CASE_TYPE: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/type',
            adapter: caseTypeAdapter
        },
        CASE_ACTIONS: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/actions',
            adapter: caseActionDataAdapter
        },
        CASE_ACTION_LABEL: {
            client: 'INFO',
            endpoint: '/actions/${actionId}/label',
            adapter: caseActionLabelAdapter
        },
        CASE_VIEW_UNALLOCATED: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/details',
            adapter: caseViewUnallocatedAdapter
        },
        DCU_POLICY_TEAM_FOR_TOPIC: {
            client: 'INFO',
            endpoint: '/team/topic/stage/DCU_DTEN_INITIAL_DRAFT',
            type: listService.types.DYNAMIC,
        },
        SOMU_TYPES: {
            client: 'INFO',
            endpoint: '/somuType',
            type: listService.types.STATIC,
            adapter: somuTypesAdapter
        },
        CASE_SOMU_ITEM: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/item/${somuTypeId}',
            type: listService.types.DYNAMIC,
            adapter: somuItemsAdapter
        },
        EX_GRATIA_BUS_REPS: {
            client: 'INFO',
            endpoint: '/entity/list/EXGRATIA_BUS_REPS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        SECRETARIAT_LIST: {
            client: 'INFO',
            endpoint: '/entity/list/SECRETARIAT_LIST',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        FOI_ACCOUNT_MANAGERS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_ACCOUNT_MANAGERS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        FOI_EXTENSION_REASONS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_EXTENSION_REASONS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_TYPES: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_TYPES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_DIRECTORATES: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_DIRECTORATES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        FOI_APPROVER_ROLES: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_APPROVER_ROLES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        FOI_EXEMPTIONS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_EXEMPTIONS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        FOI_EIR_EXCEPTIONS: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_EIR_EXCEPTIONS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        FOI_APPEAL_TYPES: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_APPEAL_TYPES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        FOI_INTERESTED_PARTIES: {
            client: 'INFO',
            endpoint: '/entity/list/FOI_INTERESTED_PARTIES',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_KIMU_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/6978176d-15e7-4a76-b833-3b0be12c0828/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_BF_CSU_LIST: {
            client: 'INFO',
            endpoint: '/entity/list/BF_CSU_LIST',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_RECIPIENTS: {
            client: 'INFO',
            endpoint: '/entity/list/TO_RECIPIENTS',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_NORTH_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_NORTH_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_CENTRAL_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_CENTRAL_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_HEATHROW_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_HEATHROW_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_SOUTH_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_SOUTH_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_SOUTH_EAST_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_SOUTH_EAST_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_EUROPE_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_EUROPE_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_BF_INTEL: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_BF_INTEL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_OPS_LOGISTICS: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_OPS_LOGISTICS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_WARNING_INDEX_COMPLAINTS: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_WARNING_INDEX_COMPLAINTS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_BUS_AREA_UNKNOWN: {
            client: 'INFO',
            endpoint: '/entity/list/BF_BUS_AREA_UNKNOWN',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/BF_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_COMPLAINT_REASON_FULL: {
            client: 'INFO',
            endpoint: '/entity/list/BF_COMPLAINT_REASON_FULL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_BF_COMPLAINT_REASON_SERVICE: {
            client: 'INFO',
            endpoint: '/entity/list/BF_COMPLAINT_REASON_SERVICE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_ALL: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_ALL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUSINESS_UNIT_TYPES: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUSINESS_UNIT_TYPES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_SUBJECTS: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_SUBJECTS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_ENQUIRY_SUBJECTS: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_ENQUIRY_SUBJECTS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_ENQUIRY_REASON_CUSTOMS: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_ENQUIRY_REASON_CUSTOMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_ENQUIRY_REASON_IMMIGRATION: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_ENQUIRY_REASON_IMMIGRATION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_ENQUIRY_REASON_OUTWARD_BOUND: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_ENQUIRY_REASON_OUTWARD_BOUND',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_ENQUIRY_REASON_OTHER: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_ENQUIRY_REASON_OTHER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASONS_ALL: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASONS_ALL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_COMP_HAND: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_COMP_HAND',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_COMP_REJ: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_COMP_REJ',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_DOC: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_DOC',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_GUID: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_GUID',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_IM_HEALTH_SUR: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_IM_HEALTH_SUR',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_PERS: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_PERS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_TECH: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_TECH',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_SRU: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_SRU',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_ENQUIRY_REASON_OTHER: {
            client: 'INFO',
            endpoint: '/entity/list/TO_ENQUIRY_REASON_OTHER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_V_AND_C_OVERSEAS_EUROPE: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_V_AND_C_OVERSEAS_EUROPE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_V_AND_C_ROTW: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_V_AND_C_ROTW',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_V_AND_C_IN_COUNTRY: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_V_AND_C_IN_COUNTRY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_I_AND_P: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_I_AND_P',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_IE: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_IE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_E_SUPPORT: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_E_SUPPORT',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_GRO: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_GRO',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_SRU: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_SRU',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_OTHER: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_OTHER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BUS_UNIT_RASI: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BUS_UNIT_RASI',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TROF_CAMPAIGNS: {
            client: 'INFO',
            endpoint: '/entity/list/TROF_CAMPAIGNS',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        TO_STOP_LIST: {
            client: 'INFO',
            endpoint: '/entity/list/TO_STOP_LIST',
            type: listService.types.DYNAMIC,
            adapter: entityListItemsAdapter
        },
        BF_INTERESTED_PARTIES: {
            client: 'INFO',
            endpoint: '/entity/list/BF_INTERESTED_PARTIES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        BF2_INTERESTED_PARTIES: {
            client: 'INFO',
            endpoint: '/entity/list/BF_INTERESTED_PARTIES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_POGR_GRO_DRAFTING_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=POGR_GRO_DRAFTING_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        POGR_CONTRIB_BUS_AREA: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_CONTRIB_BUS_AREA',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_SMC_COMP_ORIGIN: {
            client: 'INFO',
            endpoint: '/entity/list/SMC_COMP_ORIGIN',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_ABI: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_ABI',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_CUSTOMER_COMMUNICATIONS: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_CUSTOMER_COMMUNICATIONS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_DHL: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_DHL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_DISCRIMINATORY: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_DISCRIMINATORY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_FEDEX: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_FEDEX',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_EXAMINATION: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_EXAMINATION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_CSMT: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_CSMT',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_COUNTER_SERVICES: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_COUNTER_SERVICES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_POLICY: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_POLICY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_ID_CHECKS: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_ID_CHECKS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_NATIONALITY: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_NATIONALITY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_DIGITAL: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_DIGITAL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_PAPER: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_PAPER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_PARTNERS_OTHER: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_PARTNERS_OTHER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_POL: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_POL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_QUALITY: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_QUALITY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_ROYAL_MAIL: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_ROYAL_MAIL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_TP_ADVICELINE: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_TP_ADVICELINE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_OAB: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_OAB',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_SOPRA_STERIA: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_SOPRA_STERIA',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        HMPO_COMPLAINT_CATEGORIES_SVS: {
            client: 'INFO',
            endpoint: '/entity/list/HMPO_COMPLAINT_CATEGORIES_SVS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_CSMT: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_CSMT',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_STANDARD: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_STANDARD',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_PRIORITIES: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_PRIORITIES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_EXCEPTIONS: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_EXCEPTIONS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_PDF: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_PDF',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_EMAIL_TEAM: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_EMAIL_TEAM',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_CCU_POST_TEAM: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_CCU_POST_TEAM',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_KIT: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_KIT',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_PRODUCTION_INDEXING: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_PRODUCTION_INDEXING',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_SD_FDU: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_SD_FDU',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_SD_ENGAGEMENT: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_SD_ENGAGEMENT',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_SYSTEMS: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_SYSTEMS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_ARC_ADOPTIONS: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_ARC_ADOPTIONS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_ARC_CASEWORK: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_ARC_CASEWORK',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_POLICY: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_POLICY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_POLICY_BUSINESS: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_POLICY_BUSINESS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_DHL: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_DHL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_ROYAL_MAIL: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_ROYAL_MAIL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_MAIL: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_MAIL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_WORLD_PAY: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_THIRD_PARTY_WORLD_PAY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_COMPLAINT_CATEGORIES_OTHER: {
            client: 'INFO',
            endpoint: '/entity/list/GRO_COMPLAINT_CATEGORIES_OTHER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_EX_GRATIA_TYPE_OF_REFUND: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_GRO_EX_GRATIA_TYPE_OF_REFUND',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_EX_GRATIA_PRIMARY_REFUND_REASON: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_GRO_EX_GRATIA_PRIMARY_REFUND_REASON',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        GRO_EX_GRATIA_PAYMENT_METHOD: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_GRO_EX_GRATIA_PAYMENT_METHOD',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUSINESS_UNIT_TYPES: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUSINESS_UNIT_TYPES',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_POLICY: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_POLICY',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_CENTRAL_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_CENTRAL_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_EUROPE_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_EUROPE_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_HEATHROW_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_HEATHROW_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_NORTH_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_NORTH_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_PRESS_OFFICE: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_PRESS_OFFICE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_SOUTH_EAST_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_SOUTH_EAST_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_SOUTH_REGION: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_SOUTH_REGION',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_WARNING_INDEX: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUS_UNIT_WARNING_INDEX',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        TO_BF_BUS_UNIT_ALL: {
            client: 'INFO',
            endpoint: '/entity/list/TO_BF_BUSINESS_UNIT_ALL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        POGR_HMPO_LOCATIONS: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_HMPO_LOCATIONS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        POGR_HMPO_EX_GRATIA_TYPE_OF_REFUND: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_HMPO_EX_GRATIA_TYPE_OF_REFUND',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        POGR_HMPO_EX_GRATIA_REFUND_REASON: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_HMPO_EX_GRATIA_REFUND_REASON',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        POGR_HMPO_EX_GRATIA_PAYMENT_METHOD: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_HMPO_EX_GRATIA_PAYMENT_METHOD',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        POGR_HMPO_DOCUMENT_DAMAGE_TYPE: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_HMPO_DOCUMENT_DAMAGE_TYPE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        POGR_HMPO_DOCUMENT_TYPE: {
            client: 'INFO',
            endpoint: '/entity/list/POGR_HMPO_DOCUMENT_TYPE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        IEDET_COMP_CATEGORIES_SERVICE: {
            client: 'INFO',
            endpoint: '/entity/list/IEDET_COMP_CATEGORIES_SERVICE',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        IEDET_COMP_CATEGORIES_SERIOUS_AND_MINOR: {
            client: 'INFO',
            endpoint: '/entity/list/IEDET_COMP_CATEGORIES_SERIOUS_AND_MINOR',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        IEDET_COMP_CATEGORIES_SERIOUS: {
            client: 'INFO',
            endpoint: '/entity/list/IEDET_COMP_CATEGORIES_SERIOUS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        IEDET_BUSINESS_AREAS: {
            client: 'INFO',
            endpoint: '/entity/list/IEDET_BUSINESS_AREAS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        }
    },
    clients: {
        CASEWORK: caseworkService,
        WORKFLOW: workflowService,
        INFO: infoService
    }
};
