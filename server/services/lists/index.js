const staticListDefinitions = {
};

const listDefinitions = {
    workflowTypes: () => '/casetype/single',
    workflowTypesBulk: () => '/casetype/bulk',
    memberList: ({ caseType }) => `/casetype/${caseType}/allmembers`
};

module.exports = {
    staticListDefinitions,
    listDefinitions
};