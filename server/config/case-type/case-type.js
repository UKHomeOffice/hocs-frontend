const documentTags = require('./creation-document-tag.json');

const fetchCaseTypeCreationDocumentTag = (caseType) => {
    return documentTags[caseType];
};

module.exports = {
    fetchCaseTypeCreationDocumentTag
};
