module.exports = async (data, { configuration, logger }) => {
    logger.debug('REQUEST_CASE_DOCUMENTS', { documents: data.documents.length });

    const reduceDocumentsByType = (groups, document) => {
        const group = groups.get(document.type);
        group && group.push(document);
        return groups;
    };

    return [...data.documents
        .sort((a, b) => Date.parse(a.created) > Date.parse(b.created) ? 1 : 0)
        .map(({ displayName, uuid, created, status, type }) => ({
            label: displayName,
            status,
            tags: [status],
            timeStamp: created,
            type,
            value: uuid,
        }))
        .reduce(reduceDocumentsByType, new Map(configuration.documentLabels.map(label => [label, []])))];
};