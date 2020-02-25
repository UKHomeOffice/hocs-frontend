const convertNote = fromStaticList => async ({ eventTime, type, userName: authorId, body = {}, noteCount }) => {
    const { caseNote, allocatedToUUID: allocationId, stage: stageId, documentTitle: document, topicName: topic, fullname: correspondent } = body;

    const date = formatDate(eventTime);
    const author = await fromStaticList('S_USERS', authorId);
    const auditData = {
        allocationId,
        note: caseNote,
        stage: await fromStaticList('S_STAGETYPES', stageId),
        document,
        topic,
        correspondent,
        noteCount
    };
    if (typeAdaptors[type]) {
        const { title, ...content } = await typeAdaptors[type](auditData, fromStaticList);
        return { title, body: { author, ...content, date }, type };
    }
    return { title: 'System event', body: { author, ...auditData, date }, type };
};

const typeAdaptors = {
    STAGE_ALLOCATED_TO_USER: async ({ allocationId, stage }, fromStaticList) => ({
        stage,
        title: `Allocated to ${await fromStaticList('S_USERS', allocationId)}`
    }),
    STAGE_ALLOCATED_TO_TEAM: async ({ allocationId, stage }, fromStaticList) => ({
        stage,
        title: `Allocated to the ${await fromStaticList('S_TEAMS', allocationId)}`
    }),
    STAGE_CREATED: async ({ stage }) => ({
        title: `Stage: ${stage} Started`
    }),
    STAGE_COMPLETED: async ({ stage }) => ({
        title: `Stage: ${stage} Completed`
    }),
    STAGE_RECREATED: async ({ stage }) => ({
        title: `Stage: ${stage} Started`
    }),
    CORRESPONDENT_CREATED: ({ correspondent, stage }) => ({
        stage,
        title: `Correspondent: ${correspondent} Added`
    }),
    CORRESPONDENT_DELETED: ({ correspondent, stage }) => ({
        stage,
        title: `Correspondent: ${correspondent} Removed`
    }),
    CASE_TOPIC_CREATED: ({ stage, topic }) => ({
        stage,
        title: `Topic: ${topic} Added`
    }),
    CASE_TOPIC_DELETED: ({ stage, topic }) => ({
        stage,
        title: `Topic: ${topic} Removed`
    }),
    CASE_CREATED: ({ stage }) => ({
        stage,
        title: 'Case Created'
    }),
    CASE_COMPLETED: ({ stage }) => ({
        stage,
        title: 'Case Closed'
    }),
    DOCUMENT_CREATED: ({ document, stage }) => ({
        stage,
        title: `Document: ${document} Created`
    }),
    DOCUMENT_DELETED: ({ document, stage }) => ({
        stage,
        title: `Document: ${document} Deleted`
    }),
    MANUAL: ({ noteCount, note }) => ({
        note,
        title: `${noteCount}`
    }),
    ALLOCATE: ({ note }) => ({
        note,
        title: 'Allocation Note'
    }),
    REJECT: ({ note }) => ({
        note,
        title: 'Rejection Note'
    })
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
    let noteCount = 0;
    return await Promise.all(data
        .sort((a, b) => Date.parse(a.eventTime) - Date.parse(b.eventTime))
        .map(({ type, ...rest }) => {
            if (type === 'MANUAL') {
                noteCount++;
                return { ...rest, type, noteCount };
            }
            return { ...rest, type };
        })
        .reverse()
        .map(convertNote(fromStaticList))
    );
};
