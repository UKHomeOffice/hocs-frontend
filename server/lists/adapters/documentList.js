module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_DOCUMENT_LIST', { documents: data.documents.length });
    return data.documents
        .sort((a, b) => Date.parse(b.created) - Date.parse(a.created))
        .map(({ displayName, uuid, created, type, status }) => {
            const tags = [];
            tags.push(type);
            tags.push(status);
            return { label: displayName, value: uuid, timeStamp: created, status, tags: tags.length > 0 ? tags : null };
        });
};