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

const getFirstDocument = (flatDocumentList) => {
    if (Array.isArray(flatDocumentList)) {
        const { value: firstDocument } = flatDocumentList.filter(({ status }) => status !== 'PENDING')[0] || { value: undefined };
        return firstDocument;
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
    getFirstDocument,
    hasPendingDocuments
};

