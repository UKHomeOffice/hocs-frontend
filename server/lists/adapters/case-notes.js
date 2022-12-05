const convertNote = (fromStaticList, fetchList) => async ({ editorName, editedTime, eventTime, type, userName: authorId, body = {}, noteCount, timelineItemUUID }) => {
    const { caseNote, note, allocatedToUUID: allocationId, stage: stageId, documentTitle: document, topicName: topic, fullname: correspondent } = body;

    const date = formatDate(eventTime);
    const modifiedDate = formatDate(editedTime);
    const author = await fromStaticList('S_USERS', authorId);
    const modifiedBy = await fromStaticList('S_USERS', editorName);
    const auditData = {
        allocationId,
        note: caseNote || note,
        stage: await fromStaticList('S_STAGETYPES', stageId),
        document,
        topic,
        body,
        correspondent,
        noteCount,
        actionLabel: body.caseTypeActionUuid ? await fetchList('CASE_ACTION_LABEL',
            { actionId: body.caseTypeActionUuid }) : ''
    };
    if (typeAdaptors[type]) {
        const { title, ...content } = await typeAdaptors[type](auditData, fromStaticList, fetchList);
        // todo: take correct modified fields once available
        return { title, body: { author, ...content, date, modifiedBy, modifiedDate }, timelineItemUUID, type };
    }
    return { title: 'System event', body: { author, ...auditData, date }, timelineItemUUID, type };
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
    CORRESPONDENT_UPDATED: ({ correspondent, stage }) => ({
        stage,
        title: `Correspondent: ${correspondent} Updated`
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
        title: `Case note ${noteCount}`
    }),
    ALLOCATE: ({ note }) => ({
        note,
        title: 'Allocation note'
    }),
    CHANGE: ({ note }) => ({
        note,
        title: 'Change note'
    }),
    CLOSE: ({ note }) => ({
        note,
        title: 'Case closure note'
    }),
    REFER: ({ note }) => ({
        note,
        title: 'Case referred note'
    }),
    REJECT: ({ note }) => ({
        note,
        title: 'Rejection note'
    }),
    PO_APPROVAL: ({ note }) => ({
        note,
        title: 'Press Office Approval note'
    }),
    PHONECALL: ({ note }) => ({
        note,
        title: 'Phone call summary'
    }),
    REQUEST_CONTRIBUTION: ({ note }) => ({
        note,
        title: 'Contribution request note'
    }),
    CLOSE_CASE_TELEPHONE: ({ note }) => ({
        note,
        title: 'Close Case (Telephone) note'
    }),
    CONVERTED_CASE_TO_MINISTERIAL: ({ note }) => ({
        note,
        title: 'Conversion note: Case Converted to Ministerial'
    }),
    CONVERTED_CASE_TO_OFFICIAL: ({ note }) => ({
        note,
        title: 'Conversion note: Case Converted to Official'
    }),
    SEND_TO_WORKFLOW_MANAGER: ({ note }) => ({
        note,
        title: 'Escalation note'
    }),
    FOLLOW_UP: ({ note }) => ({
        note,
        title: 'Details of follow up'
    }),
    FOLLOW_UP_NOT_COMPLETED: ({ note }) => ({
        note,
        title: 'Follow up not completed'
    }),
    WITHDRAW: ({ note }) => ({
        note,
        title: 'Case withdrawn'
    }),
    CASE_TRANSFER_REASON: ({ note }) => ({
        note,
        title: 'Case transfer reason'
    }),
    EXTENSION_APPLIED: ({ note }) => ({
        note,
        title: 'Case Extension',
    }),
    ENQUIRY_REASON_EUNATIONAL_OTHERDETAILS: ({ note }) => ({
        note,
        title: 'Compliance measures - Other'
    }),
    APPEAL_CREATED: ({ actionLabel }) => ({
        title: `Appeal Created: ${actionLabel}`
    }),
    APPEAL_UPDATED: ({ actionLabel }) => ({
        title: `Appeal Updated: ${actionLabel}`
    }),
    EXTERNAL_INTEREST_CREATED: async ({ body: { caseType, partyType, interestDetails } }, _, fetchList) => {
        const parties = await fetchList(`${caseType}_INTERESTED_PARTIES`);
        const partyLabel = parties.find(party => party.value === partyType).label;

        return {
            title: `External Interest Created: ${partyLabel}`,
            note: interestDetails
        };
    },
    EXTERNAL_INTEREST_UPDATED: async ({ body: { caseType, partyType, interestDetails } }, _, fetchList) => {
        const parties = await fetchList(`${caseType}_INTERESTED_PARTIES`);
        const partyLabel = parties.find(party => party.value === partyType).label;

        return {
            title: `External Interest Updated: ${partyLabel}`,
            note: interestDetails
        };
    },
    RECORD_INTEREST: ({ note }) => ({
        note,
        title: 'Interest Recorded'
    }),
    UPDATE_INTEREST: ({ note }) => ({
        note,
        title: 'Interest Updated'
    }),
    EX_GRATIA_UPDATE: ({ note }) => ({
        note,
        title: 'Ex-Gratia Updated'
    }),
    CASE_SUSPENSION_APPLIED: ({ note }) => ({
        note,
        title: 'Case Suspension Applied'
    }),
    CASE_SUSPENSION_REMOVED: ({ note }) => ({
        note,
        title: 'Case Suspension Removed'
    }),
    OFFLINE_CASE_TRANSFER : ({ note }) => ({
        note: note,
        title: 'Offline Case Transfer'
    }),
    DATA_FIELD_UPDATED: ({ body }) => ({
        title: `${body.fieldNameLabel}${body.previousValue ? ' changed to' : ''}: ${body.newValueLabel}`
    }),
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
        timeZone: 'Europe/London',
        hour12: false
    }).formatToParts(date)
        .reduce((parts, { type, value }) => {
            parts[type] = value;
            return parts;
        }, {});
    return `${day} ${month} ${year} at ${hour}:${minute}`;
};

module.exports = async (data, { fromStaticList, fetchList, logger }) => {
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
        .map(convertNote(fromStaticList, fetchList))
    );
};
