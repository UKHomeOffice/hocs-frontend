import sortByTimeStamp from './sortByTimeStamp';

const flattenDocuments = (documents) => {
    if (Array.isArray(documents) && documents.length > 0){
        return documents
            .map(([, groupDocs]) => groupDocs)
            .reduce((reducer, value) => [...reducer, ...value])
            .sort(sortByTimeStamp);
    }
    return [];
};

const getFirstDocumentWithPdfLink = (flatDocumentList) => {
    if (Array.isArray(flatDocumentList)) {
        const firstDocument = flatDocumentList
            .filter(({ hasPdf }) => hasPdf)
            .shift();
        return firstDocument?.value;
    }
    return undefined;
};

const hasPendingDocuments = (documents) => {
    if (Array.isArray(documents)) {
        return documents.some(d => d.status === 'PENDING');
    }
    return false;
};

export {
    flattenDocuments,
    getFirstDocumentWithPdfLink,
    hasPendingDocuments
};
