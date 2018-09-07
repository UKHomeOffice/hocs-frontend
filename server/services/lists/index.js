const staticListDefinitions = {
};

const listDefinitions = {
    workflowTypes: () => '/casetype/single',
    workflowTypesBulk: () => '/casetype/bulk',
    memberList: ({ caseType }) => `/casetype/${caseType}/members`
};

module.exports = {
    staticListDefinitions,
    listDefinitions
};