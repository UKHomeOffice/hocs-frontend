const staticListDefinitions = {
};

const listDefinitions = {
    workflowTypes: () => '/casetype/single',
    workflowTypesBulk: () => '/casetype/bulk',
    memberList: ({ caseType }) => `/casetype/${caseType}/allmembers`,
    caseDocuments: ({ caseId }) => `/document/case/${caseId}`
};

module.exports = {
    staticListDefinitions,
    listDefinitions
};