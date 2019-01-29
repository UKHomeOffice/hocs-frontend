const staticListDefinitions = {
    users: '/users',
    teams: '/team',
    caseTypes: '/caseType',
    stageTypes: '/stageType'
};

const listDefinitions = {
    dashboard: () => '/stage',
    workflowTypes: () => '/caseType?bulkOnly=false',
    workflowTypesBulk: () => '/caseType?bulkOnly=true',
    memberList: () => '/member',
    ministerList: () => '/minister',
    caseDocuments: ({ caseId }) => `/document/case/${caseId}`,
    caseDocumentsType: ({ caseId, type }) => `/document/case/${caseId}/${type}`,
    standardLines: ({ caseId }) => `/case/${caseId}/standardLine`,
    templates: ({ caseId }) => `/case/${caseId}/template`,
    caseTopics: ({ caseId }) => `/case/${caseId}/topic`,
    topicsCaseType: ({ caseId }) => `/case/${caseId}/topiclist`,
    correspondentTypes: () => '/correspondentType',
    caseCorrespondents: ({ caseId }) => `/case/${caseId}/correspondent`,
    // userTopics: () => '/topics/user'
    userTopics: () => '/topics/MIN',
    caseSummary: ({ caseId }) => `/case/${caseId}/summary`
};

module.exports = {
    staticListDefinitions,
    listDefinitions
};