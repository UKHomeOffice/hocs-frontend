const getTitle = ({ correspondent, document, stage, team, topic, user }, type) => {

    const types = {
        STAGE_ALLOCATED_TO_USER: `Allocated to ${user}`,
        STAGE_ALLOCATED_TO_TEAM: `Allocated to the ${team}`,
        STAGE_CREATED: `Stage: ${stage} Started`,
        STAGE_COMPLETED: `Stage: ${stage} Completed`,
        STAGE_RECREATED: `Stage: ${stage} Started`,
        CORRESPONDENT_CREATED: `Correspondent: ${correspondent} Added`,
        CORRESPONDENT_DELETED: `Correspondent: ${correspondent} Removed`,
        CASE_TOPIC_CREATED: `Topic: ${topic} Added`,
        CASE_TOPIC_DELETED: `Topic: ${topic} Removed`,
        CASE_CREATED: 'Case Created',
        CASE_COMPLETED: 'Case Closed',
        DOCUMENT_CREATED: `Document: ${document} Created`,
        DOCUMENT_DELETED: `Document: ${document} Deleted`,
        MANUAL: 'Case Note',
        ALLOCATE: 'Allocation Note',
        REJECT: 'Rejection Note',
    };
    return types.hasOwnProperty(type) ? types[type] : 'System event';
};

const formatDate = (rawDate) => {
    const milliseconds = Date.parse(rawDate);
    if (!milliseconds) {
        return null;
    }
    const date = new Date(milliseconds);
    const { day, hour, minute, month, year } = Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Europe/London'
    }).formatToParts(date)
        .reduce((parts, { type, value }) => {
            parts[type] = value;
            return parts;
        }, {});
    return `${day} ${month} ${year} at ${hour}:${minute}`;
};

module.exports = async (data, { fromStaticList, logger }) => {
    logger.debug('REQUEST_CASE_NOTES', { notes: data.length });
    return await Promise.all(data
        .sort((a, b) => new Date(a.eventTime) < new Date(b.eventTime) ? 1 : -1)
        .map(async ({ eventTime, type, userName: authorId, body = {} }) => {
            const { caseNote, allocatedToUUID: allocationId, stage: stageId, documentTitle: document, topicName: topic, fullname: correspondent } = body;

            const auditBody = {
                date: formatDate(eventTime),
                note: caseNote,
                author: await fromStaticList('S_USERS', authorId),
                user: await fromStaticList('S_USERS', allocationId),
                team: await fromStaticList('S_TEAMS', allocationId),
                stage: await fromStaticList('S_STAGETYPES', stageId),
                document,
                topic,
                correspondent,
            };

            return {
                body: auditBody,
                title: getTitle(auditBody, type),
                type,
            };
        }));
};