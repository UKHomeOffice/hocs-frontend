const { caseworkService, infoService, documentService } = require('../clients/index');
const listService = require('../list');
const { Choice } = require('../services/forms/component-builder');
const workstack = require('./adapters/workstacks');
const topicAdapter = require('./adapters/topics');
const usersAdapter = require('./adapters/users');
const teamsAdapter = require('./adapters/teams');
const templatesAdapter = require('./adapters/templates');
const membersAdapter = require('./adapters/members');
const documentsAdapter = require('./adapters/document');
const caseNoteAdapter = require('./adapters/case-notes');
const caseSummaryAdapter = require('./adapters/case-summary');

const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = {
    Lists: {
        S_TEAMS: {
            Client: 'INFO',
            Endpoint: '/team',
            Type: listService.types.STATIC,
            Adapter: data => data
                .map(({ type, displayName }) => ({ key: type, value: displayName }))
        },
        S_USERS: {
            Client: 'INFO',
            Endpoint: '/users',
            Type: listService.types.STATIC,
            Adapter: data => data
                .map(({ id, username }) => ({ key: id, value: username }))
        },
        S_CASETYPES: {
            Client: 'INFO',
            Endpoint: '/caseType',
            Type: listService.types.STATIC,
            Adapter: data => data.caseTypes
                .map(({ label, value }) => ({ key: value, value: label }))
        },
        S_STAGETYPES: {
            Client: 'INFO',
            Endpoint: '/stageType',
            Type: listService.types.STATIC,
            Adapter: data => data.stageTypes
                .map(({ label, value }) => ({ key: value, value: label }))
        },
        CASE_TYPES: {
            Client: 'INFO',
            Endpoint: '/caseType?bulkOnly=false',
            Adapter: data => data.caseTypes
                .sort(byLabel)
                .map(({ label, value }) => Choice(label, value))
        },
        CASE_TYPES_BULK: {
            Client: 'INFO',
            Endpoint: '/caseType?bulkOnly=true',
            Adapter: data => data.caseTypes
                .sort(byLabel)
                .map(({ label, value }) => Choice(label, value))
        },
        DASHBOARD: {
            Client: 'CASEWORK',
            Endpoint: '/stage',
            Adapter: workstack.dashboardAdapter
        },
        USER_WORKSTACK: {
            Client: 'CASEWORK',
            Endpoint: '/stage',
            Adapter: workstack.userAdapter
        },
        TEAM_WORKSTACK: {
            Client: 'CASEWORK',
            Endpoint: '/stage',
            Adapter: workstack.teamAdapter
        },
        WORKFLOW_WORKSTACK: {
            Client: 'CASEWORK',
            Endpoint: '/stage',
            Adapter: workstack.workflowAdapter
        },
        STAGE_WORKSTACK: {
            Client: 'CASEWORK',
            Endpoint: '/stage',
            Adapter: workstack.stageAdapter
        },
        DRAFT_TEAMS: {
            Client: 'INFO',
            Endpoint: '/teams/drafter',
            Adapter: teamsAdapter
        },
        PRIVATE_OFFICE_TEAMS: {
            Client: 'INFO',
            Endpoint: '/teams?unit=PRIVATE_OFFICE',
            Adapter: teamsAdapter
        },
        USERS_FOR_CASE: {
            Client: 'INFO',
            Endpoint: '/case/${caseId}/stage/${stageId}/team/members',
            Adapter: usersAdapter
        },
        USERS_IN_TEAM: {
            Client: 'INFO',
            Endpoint: '/teams/${teamId}/members',
            Adapter: usersAdapter
        },
        CASE_CORRESPONDENTS: {
            Client: 'CASEWORK',
            Endpoint: '/case/${caseId}/correspondent',
            Adapter: data => data.map(c => ({ label: c.fullname, value: c.uuid }))
        },
        CORRESPONDENT_TYPES: {
            Client: 'INFO',
            Endpoint: '/correspondentType',
            Adapter: data => data.map().sort(byLabel)
        },
        TOPICS_USER: {
            Client: 'INFO',
            Endpoint: '/topics/MIN',
            Adapter: topicAdapter
        },
        TOPICS_CASETYPE: {
            Client: 'INFO',
            Endpoint: '/case/${caseId}/topiclist',
            Adapter: topicAdapter
        },
        CASE_TOPICS: {
            Client: 'CASEWORK',
            Endpoint: '/case/${caseId}/topic'
        },
        CASE_TEMPLATES: {
            Client: 'CASEWORK',
            Endpoint: '/case/${caseId}/topic',
            Adapter: templatesAdapter
        },
        CASE_STANDARD_LINES: {
            Client: 'CASEWORK',
            Endpoint: '/case/${caseId}/topic',
            Adapter: templatesAdapter
        },
        MINISTERS: {
            Client: 'INFO',
            Endpoint: '/minister',
            Adapter: data => data.ministers.sort(byLabel)
        },
        MEMBER_LIST: {
            Client: 'INFO',
            Endpoint: '/member',
            Adapter: membersAdapter
        },
        CASE_DOCUMENT_LIST: {
            Client: 'DOCUMENT',
            Endpoint: '/document/case/${caseId}/${type}',
            Adapter: documentsAdapter
        },
        CASE_DOCUMENT_LIST_FINAL: {
            Client: 'DOCUMENT',
            Endpoint: '/document/case/${caseId}/FINAL',
            Adapter: documentsAdapter
        },
        CASE_DOCUMENT_LIST_DRAFT: {
            Client: 'DOCUMENT',
            Endpoint: '/document/case/${caseId}/DRAFT',
            Adapter: documentsAdapter
        },
        CASE_NOTES: {
            Client: 'CASEWORK',
            Endpoint: '/case/${caseId/timeline}',
            Adapter: caseNoteAdapter
        },
        CASE_SUMMARY: {
            Client: 'CASEWORK',
            Endpoint: '/case/${caseId}/summary',
            Adapter: caseSummaryAdapter
        },
    },
    Clients: {
        CASEWORK: caseworkService,
        INFO: infoService,
        DOCUMENT: documentService
    }
};