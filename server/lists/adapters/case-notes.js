const getTitle = (type) => {
    const types = {
        STAGE_ALLOCATED_TO_USER: 'Allocated to User',
        STAGE_ALLOCATED_TO_TEAM: 'Allocated to Team',
        STAGE_CREATED: 'Stage Started',
        STAGE_COMPLETED: 'Stage Completed',
        CORRESPONDENT_CREATED: 'Correspondent Added',
        CORRESPONDENT_DELETED: 'Correspondent Removed',
        CASE_TOPIC_CREATED: 'Topic Added',
        CASE_TOPIC_DELETED: 'Topic Removed',
        CASE_CREATED: 'Case Created',
        DOCUMENT_CREATED: 'Document Created',
        DOCUMENT_DELETED: 'Document Deleted',
        MANUAL: 'Case Note',
        ALLOCATE: 'Allocation Note',
        REJECT: 'Rejection Note'

    };
    return types.hasOwnProperty(type) ? types[type] : 'System event';
};

const formatDate = (rawDate) => {
    const date = Date.parse(rawDate);
    if (!date) {
        return null;
    }
    return Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Europe/London'
    }).format(date);
};

module.exports = async (data, { fromStaticList, logger }) => {
    logger.debug('REQUEST_CASE_NOTES', { notes: data.length });
    return await Promise.all(data
        .sort((a, b) => new Date(a.eventTime) < new Date(b.eventTime) ? 1 : -1)
        .map(async ({ eventTime, type, userName: authorId, body = {} }) => {
            const { caseNote, allocatedToUUID: allocationId, stage: stageId, documentTitle: document, topicName: topic, fullname: correspondent } = body;
            return {
                type,
                title: getTitle(type),
                body: {
                    date: formatDate(eventTime),
                    note: caseNote,
                    author: await fromStaticList('S_USERS', authorId),
                    user: await fromStaticList('S_USERS', allocationId),
                    team: await fromStaticList('S_TEAMS', allocationId),
                    stage: await fromStaticList('S_STAGETYPES', stageId),
                    document,
                    topic,
                    correspondent
                }
            };
        }));
};