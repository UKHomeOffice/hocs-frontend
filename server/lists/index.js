const { caseworkService, infoService, workflowService } = require('../clients/index');
const listService = require('../services/list');
const statics = require('./adapters/statics');
const caseTypeAdapter = require('./adapters/case-types');
const caseTypeCommaSeparatedAdapter = require('./adapters/case-types-comma-separated');
const workstack = require('./adapters/workstacks');
const topicAdapter = require('./adapters/topics');
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
const caseViewAllStagesAdapter = require('./adapters/case-view-all-stages');
const caseViewReadOnlyAdapter = require('./adapters/case-view-read-only');
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
            type: listService.types.STATIC,
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
        S_MPAM_ENQUIRY_SUBJECTS: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_SUBJECTS',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_ALL: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_ALL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_PER: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_PER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_GUI: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_GUI',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_DOC: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_DOC',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_TECH: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_TECH',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_DET: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_DET',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_HMPO: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_HMPO',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_ENQUIRY_REASONS_OTHER: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_ENQUIRY_REASONS_OTHER',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_MPAM_BUS_UNITS_ALL: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_BUS_UNITS_ALL',
            type: listService.types.STATIC,
            adapter: entityListItemsAdapter
        },
        S_FOI_DIRECTORATE_BICSPI_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_BICSPI_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_BORDER_FORCE_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_BORDER_FORCE_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_C_AND_R_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_C_AND_R_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_COMMS_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_COMMS_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_CPFG_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_CPFG_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_DDAT_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_DDAT_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_HMPO_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_HMPO_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_HO_SCIENCE_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_HO_SCIENCE_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_HOLA_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_HOLA_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_IMMIGRATION_ENFORCEMENT_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_IMMIGRATION_ENFORCEMENT_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_OSCT_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_OSCT_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_PRIVATE_OFFICE_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_PRIVATE_OFFICE_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_SOCG_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_SOCG_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DIRECTORATE_UKVI_ACCEPTANCE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DIRECTORATE_UKVI_ACCEPTANCE_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        FOI_DRAFT_TEAMS_SELECTION: {
            client: 'INFO',
            endpoint: '/teams/descendants/stage/${stageId}/case/${caseId}',
            type: listService.types.DYNAMIC,
            adapter: teamsAdapter
        },
        S_FOI_BICSPI_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_BICSPI_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_BORDER_FORCE_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_BORDER_FORCE_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_C_AND_R_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_C_AND_R_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_COMMS_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_COMMS_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_CPFG_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_CPFG_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DDAT_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DDAT_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_HMPO_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_HMPO_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_HO_SCIENCE_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_HO_SCIENCE_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_HOLA_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_HOLA_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_IMMIGRATION_ENFORCEMENT_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_IMMIGRATION_ENFORCEMENT_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_OSCT_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_OSCT_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_PRIVATE_OFFICE_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_PRIVATE_OFFICE_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_SOCG_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_SOCG_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_UKVI_DIRECTORATE_G6_G7_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_UKVI_DIRECTORATE_G6_G7_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_BICSPI_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_BICSPI_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_BORDER_FORCE_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_BORDER_FORCE_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_C_AND_R_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_C_AND_R_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_COMMS_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_COMMS_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_CPFG_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_CPFG_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_DDAT_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_DDAT_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_HMPO_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_HMPO_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_HO_SCIENCE_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_HO_SCIENCE_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_HOLA_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_HOLA_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_IMMIGRATION_ENFORCEMENT_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_IMMIGRATION_ENFORCEMENT_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_OSCT_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_OSCT_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_PRIVATE_OFFICE_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_PRIVATE_OFFICE_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_SOCG_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_SOCG_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_UKVI_DIRECTORATE_SCS_APPROVAL_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=FOI_UKVI_DIRECTORATE_SCS_APPROVAL_TEAMS',
            type: listService.types.STATIC,
            adapter: teamsAdapter
        },
        S_FOI_BICSPI_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/f32d4c94-92cd-4652-a336-d9e3ba2990b7/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_BORDER_FORCE_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/c644ecae-84ae-4431-ac3d-b8ff9870532f/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_C_AND_R_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/f8e1448d-d131-4960-80c9-23a80056b8bc/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_COMMS_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/3c8436a9-0436-4cf7-9137-8be42952f929/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_CPFG_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/8038c2c9-4195-44c2-bae1-b5606b1c2997/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_DDAT_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/5b4d31aa-557b-4b3c-a7f9-60c65b6d1a3a/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_HMPO_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/5928e133-1e26-486f-9076-175fb0de2c7d/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_HO_SCIENCE_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/0b21928c-9511-43d2-ba13-358fce5718f7/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_HOLA_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/a1708d65-6197-47e0-9497-4ed663c4e504/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_IMMIGRATION_ENFORCEMENT_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/a30ddd17-43c0-4a5e-ad87-56fcd07cf38d/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_OSCT_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/b0cfd0ab-7fdc-4da1-b174-da278cde0385/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_PRIVATE_OFFICE_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/75135dc8-59ae-41a8-b27c-43214def80dc/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_SOCG_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/e11129f6-4ebb-4943-8757-0ab3006dbbcd/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_UKVI_DIRECTORATE_G6_G7_APPROVAL_TEAM_1_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/0dccf4d2-2404-4d58-85c7-f78a80e6ae37/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_BICSPI_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/45192592-4228-4a70-b848-533e1589cf8c/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_BORDER_FORCE_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/b2157fe8-12ee-4887-a305-ecaa4b4a77f0/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_C_AND_R_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/120e094a-1f1b-4a73-a912-bb15c8d6c58c/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_COMMS_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/4e805d68-2610-42c1-9fbe-08f22217985a/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_CPFG_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/3cc2ae90-ab11-42be-91ba-756ca8a59510/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_DDAT_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/4986074c-6322-44d6-ab0d-a709478507a8/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_HMPO_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/52b79334-1ba0-40e1-98e1-b3c211da8797/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_HO_SCIENCE_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/adbaf076-f2ea-404e-b48d-ad088aa7102f/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_HOLA_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/b4d77467-a76b-40cc-94d7-2846c254a541/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_IMMIGRATION_ENFORCEMENT_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/9312923f-df47-4319-ba60-acd395227bda/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_OSCT_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/2904d4dd-5242-4d8a-8854-2a5a55ce1329/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_PRIVATE_OFFICE_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/b2e601ee-905c-489d-b556-29b7850f2235/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_SOCG_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/f714a19b-1360-43f6-87a9-03be43a4f959/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        S_FOI_UKVI_DIRECTORATE_SCS_APPROVAL_TEAM_MEMBERS: {
            client: 'INFO',
            endpoint: '/teams/512c0cb1-c155-4c57-9c5f-7f0a63cfc29b/members',
            type: listService.types.STATIC,
            adapter: usersAdapter
        },
        MPAM_CONTRIBUTION_BUSINESS_AREAS: {
            client: 'INFO',
            endpoint: '/entity/list/MPAM_CONTRIBUTION_BUSINESS_AREAS',
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
            adapter: caseTypeAdapter
        },
        CASE_TYPES_BULK: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=true',
            adapter: caseTypeAdapter
        },
        CASE_TYPES_COMMA_SEPARATED: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=false',
            adapter: caseTypeCommaSeparatedAdapter
        },
        COUNTRIES_CURRENT: {
            client: 'INFO',
            endpoint: '/country',
            adapter: countrySortAdapter
        },
        DASHBOARD: {
            client: 'CASEWORK',
            endpoint: '/stage',
            adapter: workstack.dashboardAdapter
        },
        USER_WORKSTACK: {
            client: 'CASEWORK',
            endpoint: '/stage',
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
            endpoint: '/stage',
            adapter: workstack.workflowAdapter
        },
        STAGE_WORKSTACK: {
            client: 'CASEWORK',
            endpoint: '/stage',
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
            endpoint: '/case/foitopiclist',
            type: listService.types.DYNAMIC,
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
        CASE_DOCUMENT_LIST_FOI_DRAFT: {
            client: 'CASEWORK',
            endpoint: '/case/document/reference/${caseId}/?type=Draft%20response',
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
        CASE_VIEW_ALL_STAGES: {
            client: 'WORKFLOW',
            endpoint: '/case/${caseId}',
            adapter: caseViewAllStagesAdapter
        },
        CASE_VIEW_READ_ONLY: {
            client: 'WORKFLOW',
            endpoint: '/case/details/${caseId}',
            adapter: caseViewReadOnlyAdapter
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
    },
    clients: {
        CASEWORK: caseworkService,
        WORKFLOW: workflowService,
        INFO: infoService
    }
};
