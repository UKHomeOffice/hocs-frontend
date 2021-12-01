module.exports = {
    caseCreate: require('./case-create.js'),
    confirmCreateWcs: require('./confirm-create-wcs.js'),
    addCorrespondent: require('./add-correspondent.js'),
    addMember: require('./add-member.js'),
    addCorrespondentDetails: require('./add-correspondent-details.js'),
    updateCorrespondentDetails: require('./update-correspondent-details.js'),
    updateCorrespondentDetailsFoi: require('./update-correspondent-details-foi.js'),
    addMemberDetails: require('./add-member-details.js'),
    removeCorrespondent: require('./remove-correspondent.js'),
    addTopic: require('./add-topic.js'),
    removeTopic: require('./remove-topic.js'),
    addDocument: require('./document-add.js'),
    escalateCase: require('./document-add-next-case.js'),
    addDocumentNew: require('./add-document.js'),
    removeDocument: require('./remove-document.js'),
    manageDocuments: require('./manage-documents.js'),
    bulkCaseCreate: require('./bulk-case-create.js'),
    bulkAddDocument: require('./bulk-document-add.js'),
    addStandardLine: require('./add-standard-line.js'),
    addTemplate: require('./add-template'),
    managePeople: require('./manage-people'),
    contributionRequest: require('./contribution-request'),
    manageAppealDocuments: require('./add-appeal-document'),
    contributionRequestFoi: require('./contribution-request-foi'),
    contributionFulfillment: require('./contribution-fulfillment'),
    contributionFulfillmentFoi: require('./contribution-fulfillment-foi'),
    confirmExtendDeadlineFoi: require('./extend-deadline'),

    recordAppealFoi: require('./record-appeal'),
    updateAppealFoi: require('./update-appeal'),

    approvalRequestFoi: require('./approval-request-foi'),
    approvalFulfillmentFoi: require('./approval-fulfillment-foi'),

    recordInterest: require('./record-interest'),
    updateInterest: require('./update-interest')
};
