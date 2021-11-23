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
        .map(({ displayName, uuid, created, status, type, labels }) => {
            var tags = [];
            if (status !== 'UPLOADED') {
                tags.push(status);
            }
            if (labels) {
                tags = tags.concat(labels);
            }
            return {
                label: displayName,
                status,
                tags,
                timeStamp: created,
                type,
                value: uuid,
                labels
            };
        })
        .reduce(reduceDocumentsByType, new Map(data.documentTags.map(label => [label, []])))]
        .map(([name, documents]) => [name, documents.sort(sortByTimeStamp)]);
};