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

const formatDate = (date) => {
    return Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(date));
};

module.exports = async (data, { fromStaticList }) => {
    return await Promise.all(data
        .sort((a, b) => Date.parse(a.eventTime) > Date.parse(b.eventTime))
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