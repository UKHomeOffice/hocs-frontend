const staticListDefinitions = {
    users: '/users',
    teams: '/teams'
};

const listDefinitions = {
    dashboard: () => '/stage',
    workflowTypes: () => '/casetype/single',
    workflowTypesBulk: () => '/casetype/bulk',
    memberList: ({ caseType }) => `/casetype/${caseType}/allmembers`,
    ministerList: () => '/ministers',
    caseDocuments: ({ caseId }) => `/document/case/${caseId}`,
    caseDocumentsType: ({ caseId, type }) => `/document/case/${caseId}/${type}`,
    standardLines: ({ caseId }) => `/case/${caseId}/standard_lines`,
    templates: ({ caseId }) => `/case/${caseId}/templates`,
    caseTopics: ({ caseId }) => `/case/${caseId}/topic`,
    topicsCaseType: ({ caseId }) => `/case/${caseId}/topiclist`,
    correspondentTypes: () => '/correspondenttype',
    caseCorrespondents: ({ caseId }) => `/case/${caseId}/correspondent`,
    // userTopics: () => '/topics/user'
    userTopics: () => '/topics/MIN'
};

module.exports = {
    staticListDefinitions,
    listDefinitions
};