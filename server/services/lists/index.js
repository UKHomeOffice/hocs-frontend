const staticListDefinitions = {
};

const listDefinitions = {
    dashboard: () => '/stage/active',
    workflowTypes: () => '/casetype/single',
    workflowTypesBulk: () => '/casetype/bulk',
    memberList: ({ caseType }) => `/casetype/${caseType}/allmembers`,
    ministerList: () => '/casetype/ministers',
    caseDocuments: ({ caseId }) => `/document/case/${caseId}`
};

module.exports = {
    staticListDefinitions,
    listDefinitions
};