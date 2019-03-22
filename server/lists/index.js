const { caseworkService, infoService, documentService } = require('../clients/index');
const listService = require('../list');
const { Choice } = require('../services/forms/component-builder');
const workstack = require('./adapters/workstacks');
const topicAdapter = require('./adapters/topics');
const usersAdapter = require('./adapters/users');
const teamsAdapter = require('./adapters/teams');
const templatesAdapter = require('./adapters/templates');
const membersAdapter = require('./adapters/members');
const documentsAdapter = require('./adapters/documents');
const caseNoteAdapter = require('./adapters/case-notes');
const caseSummaryAdapter = require('./adapters/case-summary');

const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = {
    lists: {
        S_TEAMS: {
            client: 'INFO',
            endpoint: '/team',
            type: listService.types.STATIC,
            adapter: data => data
                .map(({ type, displayName }) => ({ key: type, value: displayName }))
        },
        S_USERS: {
            client: 'INFO',
            endpoint: '/users',
            type: listService.types.STATIC,
            adapter: data => data
                .map(({ id, username }) => ({ key: id, value: username }))
        },
        S_CASETYPES: {
            client: 'INFO',
            endpoint: '/caseType',
            type: listService.types.STATIC,
            adapter: data => data.caseTypes
                .map(({ label, value }) => ({ key: value, value: label }))
        },
        S_STAGETYPES: {
            client: 'INFO',
            endpoint: '/stageType',
            type: listService.types.STATIC,
            adapter: data => data.stageTypes
                .map(({ label, value }) => ({ key: value, value: label }))
        },
        CASE_TYPES: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=false',
            adapter: data => data.caseTypes
                .sort(byLabel)
                .map(({ label, value }) => Choice(label, value))
        },
        CASE_TYPES_BULK: {
            client: 'INFO',
            endpoint: '/caseType?bulkOnly=true',
            adapter: data => data.caseTypes
                .sort(byLabel)
                .map(({ label, value }) => Choice(label, value))
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
            endpoint: '/stage',
            adapter: workstack.teamAdapter
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
            endpoint: '/teams/drafter',
            adapter: teamsAdapter
        },
        PRIVATE_OFFICE_TEAMS: {
            client: 'INFO',
            endpoint: '/teams?unit=PRIVATE_OFFICE',
            adapter: teamsAdapter
        },
        USERS_FOR_CASE: {
            client: 'INFO',
            endpoint: '/case/${caseId}/stage/${stageId}/team/members',
            adapter: usersAdapter
        },
        USERS_IN_TEAM: {
            client: 'INFO',
            endpoint: '/teams/${teamId}/members',
            adapter: usersAdapter
        },
        CASE_CORRESPONDENTS: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/correspondent',
            adapter: data => data.map(c => ({ label: c.fullname, value: c.uuid }))
        },
        CORRESPONDENT_TYPES: {
            client: 'INFO',
            endpoint: '/correspondentType',
            adapter: data => data.map().sort(byLabel)
        },
        TOPICS_USER: {
            client: 'INFO',
            endpoint: '/topics/MIN',
            adapter: topicAdapter
        },
        TOPICS_CASETYPE: {
            client: 'INFO',
            endpoint: '/case/${caseId}/topiclist',
            adapter: topicAdapter
        },
        CASE_TOPICS: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/topic'
        },
        CASE_TEMPLATES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/topic',
            adapter: templatesAdapter
        },
        CASE_STANDARD_LINES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/topic',
            adapter: templatesAdapter
        },
        MINISTERS: {
            client: 'INFO',
            endpoint: '/minister',
            adapter: data => data.ministers.sort(byLabel)
        },
        MEMBER_LIST: {
            client: 'INFO',
            endpoint: '/member',
            adapter: membersAdapter
        },
        CASE_DOCUMENT_LIST: {
            client: 'DOCUMENT',
            endpoint: '/document/case/${caseId}/${type}',
            adapter: documentsAdapter
        },
        CASE_DOCUMENT_LIST_FINAL: {
            client: 'DOCUMENT',
            endpoint: '/document/case/${caseId}/FINAL',
            adapter: documentsAdapter
        },
        CASE_DOCUMENT_LIST_DRAFT: {
            client: 'DOCUMENT',
            endpoint: '/document/case/${caseId}/DRAFT',
            adapter: documentsAdapter
        },
        CASE_NOTES: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId/timeline}',
            adapter: caseNoteAdapter
        },
        CASE_SUMMARY: {
            client: 'CASEWORK',
            endpoint: '/case/${caseId}/summary',
            adapter: caseSummaryAdapter
        },
    },
    clients: {
        CASEWORK: caseworkService,
        INFO: infoService,
        DOCUMENT: documentService
    }
};