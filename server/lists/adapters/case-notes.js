const getTitle = (type) => {
    const types = {
        STAGE_ALLOCATED_TO_USER: 'Allocated to User',
        STAGE_ALLOCATED_TO_TEAM: 'Allocated to Team',
        CORRESPONDENT_CREATED: 'Correspondent Added',
        CORRESPONDENT_DELETED: 'Correspondent Removed',
        CASE_TOPIC_CREATED: 'Topic Added',
        CASE_TOPIC_DELETED: 'Topic Removed',
        CASE_CREATED: 'Case Created',
        CASE_UPDATED: 'Case Updated',
        DOCUMENT_CREATED: 'Document Created',
        DOCUMENT_DELETED: 'Document Deleted',
        MANUAL: 'Case Note'
    };
    return types.hasOwnProperty(type) ? types[type] : 'System event';
};
const parseDate = (rawDate) => {
    const [date] = rawDate.match(/[0-9]{4}-[0-1][0-9]-[0-3][0-9]/g) || [];
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split('-');
    return new Date(year, month, day);
};
const formatDate = (rawDate) => {
    const date = parseDate(rawDate);
    if (!date) {
        return null;
    }
    return Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(date);
};

module.exports = async (data, { fromStaticList, logger }) => {
    logger.debug('REQUEST_CASE_NOTES', { notes: data.length });
    return await Promise.all(data
        .sort((a, b) => new Date(a.eventTime) < new Date(b.eventTime) ? 1 : -1)
        .map(async ({ eventTime, type, userName: authorId, body = {} }) => {
            const { caseNote, userUUID: userId, teamUUID: teamId, stage: stageId } = body;
            return {
                type,
                title: getTitle(type),
                body: {
                    date: formatDate(eventTime),
                    note: caseNote,
                    author: await fromStaticList('S_USERS', authorId),
                    user: await fromStaticList('S_USERS', userId),
                    team: await fromStaticList('S_TEAMS', teamId),
                    stage: await fromStaticList('S_STAGETYPES', stageId)
                }
            };
        }));
};