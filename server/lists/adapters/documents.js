module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_DOCUMENTS', { documents: data.documents.length });
    return data.documents
        .sort((a, b) => Date.parse(a.created) > Date.parse(b.created) ? 1 : 0)
        .map(({ displayName, uuid, created, type, status }) => {
            const tags = [];
            tags.push(type);
            tags.push(status);
            return { label: displayName, value: uuid, timeStamp: created, status, tags: tags.length > 0 ? tags : null };
        });
};