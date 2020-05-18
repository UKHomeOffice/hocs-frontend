module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_DOCUMENTS', { documents: data.documents.length });

    const reduceDocumentsByType = (groups, document) => {
        const group = groups.get(document.type);
        group && group.push(document);
        return groups;
    };

    const sortByTimeStamp = ({ timeStamp: timeStampA }, { timeStamp: timeStampB }) => {
        if (timeStampA > timeStampB) {
            return -1;
        } else if (timeStampA < timeStampB) {
            return 1;
        } else {
            return 0;
        }
    };

    return [...data.documents
        .map(({ displayName, uuid, created, status, type }) => ({
            label: displayName,
            status,
            tags: [status],
            timeStamp: created,
            type,
            value: uuid,
        }))
        .reduce(reduceDocumentsByType, new Map(data.documentTags.map(label => [label, []])))]
        .map(([name, documents]) => [name, documents.sort(sortByTimeStamp)]);
};