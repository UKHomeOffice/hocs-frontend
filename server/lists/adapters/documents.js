module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_DOCUMENTS', { documents: data.documents.length });

    const tags = [
        'Claimant form',
        'Supporting evidence',
        'Matrix',
        'Outbound letter'
    ];

    const reduceDocumentsByType = (groups, document) => {
        const group = groups.get(document.type);
        group && group.push(document);
        return groups;
    };

    return [...data.documents
        .sort((a, b) => Date.parse(a.created) > Date.parse(b.created) ? 1 : 0)
        .map(({ displayName, uuid, created, status, type }) => ({
            label: displayName,
            value: uuid,
            timeStamp: created,
            status,
            type
        }))
        .reduce(reduceDocumentsByType, new Map(tags.map(tag => [tag, []])))];
};