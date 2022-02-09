const { subDays, formatDate } = require('../../libs/dateHelpers');

const byCaseReference = (a, b) => {
    if (a.caseReference == null || b.caseReference == null) {
        return 0;
    }

    return (a.caseReference < b.caseReference ? -1 : (a.caseReference > b.caseReference ? 1 : 0));
};

const byPriority = (a, b) => {
    if (a.data.systemCalculatedPriority === undefined || b.data.systemCalculatedPriority === undefined) {
        return 0;
    }

    let aFloat = parseFloat(a.data.systemCalculatedPriority);
    let bFloat = parseFloat(b.data.systemCalculatedPriority);

    return (aFloat < bFloat ? 1 : (aFloat > bFloat ? -1 : 0));
};

/**
 * Used in tagSort compare function.
 * a.tag and b.tag are arrays, we compare lengths to determine if a case has tags.
 * If a case has tags, it has a higher precedence in a workstack so is moved higher in the rendered list in the UI.
 * If both cases being compared have tags, or do not have tags, they have the same precedence so we don't alter the
 * ordering.
 */
const byTag = (a, b) => {

    if (a.tag.length > 0 && b.tag.length < 1) {
        return -1;
    }

    if (a.tag.length < 1 && b.tag.length > 0) {
        return 1;
    }

    return 0;
};

const tagSort = (a, b) => {
    let sortResult = 0;

    if (a.tag || b.tag) {
        sortResult = byTag(a, b);
    }

    return sortResult;
};

const defaultCaseSort = (a, b) => {
    let sortResult = tagSort(a,b);

    if (sortResult === 0) {
        sortResult = byPriority(a, b);
        if (sortResult === 0) {
            sortResult = byCaseReference(a, b);
        }
    }

    return sortResult;
};

const byLabel = (a, b) => (a.label < b.label ? -1 : (a.label > b.label ? 1 : 0));

const isUnallocated = user => user === null;

const isOverdue = (configuration, deadline, lastDueDay) =>
    configuration.deadlinesEnabled &&
    deadline &&
    new Date(deadline) <= lastDueDay;

const returnWorkstackColumns = (configuration, workstackData) => {
    const defaultColumnConfig = 'DEFAULT';
    const caseTypeForColumnConfig = workstackData.length > 0 ? workstackData[0].caseType : defaultColumnConfig;

    let getColumnsForWorkstack = configuration.workstackTypeColumns.find(
        item => item.workstackType === caseTypeForColumnConfig
    );

    if (getColumnsForWorkstack === undefined) {
        getColumnsForWorkstack = configuration.workstackTypeColumns.find(
            item => item.workstackType === defaultColumnConfig
        );
    }

    return getColumnsForWorkstack.workstackColumns;
};

const returnTeamWorkstackColumns = (configuration, workstackData, teamId) => {
    const defaultColumnConfig = 'DEFAULT';
    const caseTypeForColumnConfig = workstackData.length > 0 ? workstackData[0].caseType : defaultColumnConfig;

    // check if we have exact match for team id (workstack specific for team)
    let getColumnsForWorkstack = configuration.workstackTypeColumns.find(
        item => item.workstackType === teamId
    );

    // otherwise use workstack for case type
    if (getColumnsForWorkstack === undefined) {
        getColumnsForWorkstack = configuration.workstackTypeColumns.find(
            item => item.workstackType === caseTypeForColumnConfig
        );
    }

    // if above is not configured, use DEFAULT workstack columns
    if (getColumnsForWorkstack === undefined) {
        getColumnsForWorkstack = configuration.workstackTypeColumns.find(
            item => item.workstackType === defaultColumnConfig
        );
    }

    return getColumnsForWorkstack.workstackColumns;
};

const returnMyCasesWorkstackColumns = (configuration, workstackData) => {
    const defaultColumnConfig = 'DEFAULT';
    const caseTypeForColumnConfig = workstackData.length > 0 ? workstackData[0].caseType : defaultColumnConfig;

    let getColumnsForMyCases = configuration.workstackTypeColumns.find(
        item => item.workstackType === (caseTypeForColumnConfig + '_MY_CASES')
    );

    if (getColumnsForMyCases === undefined) {
        getColumnsForMyCases = configuration.workstackTypeColumns.find(
            item => item.workstackType === caseTypeForColumnConfig
        );
    }

    if (getColumnsForMyCases === undefined) {
        getColumnsForMyCases = configuration.workstackTypeColumns.find(
            item => item.workstackType === defaultColumnConfig
        );
    }

    return getColumnsForMyCases.workstackColumns;
};

const getCorrespondentsNameByType = (correspondents, types) =>
    correspondents.correspondents.filter(correspondent => types.includes(correspondent.type))
        .map(correspondent => correspondent.fullname)
        .join(', ');

const bindDisplayElements = fromStaticList => async (stage) => {
    stage.assignedTeamDisplay = await fromStaticList('S_ALL_TEAMS', stage.teamUUID);
    stage.caseTypeDisplayFull = await fromStaticList('S_CASETYPES', stage.caseType);

    if (stage.assignedTopic) {
        stage.assignedTopicDisplay = stage.assignedTopic;
    }
    if (stage.active) {
        stage.stageTypeDisplay = await fromStaticList('S_STAGETYPES', stage.stageType);
    } else {
        stage.stageTypeDisplay = 'Closed';
    }
    if (stage.userUUID) {
        stage.assignedUserDisplay = await fromStaticList('S_USERS', stage.userUUID) || 'Allocated';
    }
    if (stage.data && stage.data.CampaignType) {
        stage.campaignDisplay = await fromStaticList('S_MPAM_CAMPAIGNS', stage.data.CampaignType) || stage.data.CampaignType;
    }
    if (stage.data && stage.data.MinSignOffTeam) {
        stage.MinSignOffTeamDisplay = await fromStaticList('S_MPAM_MIN_SIGN_OFF_TEAMS', stage.data.MinSignOffTeam) || stage.data.MinSignOffTeam;
    }
    stage.deadlineDisplay = formatDate(stage.deadline);

    stage.stageTypeWithDueDateDisplay = stage.stageTypeDisplay;

    stage.stageTypeWithDueDateDisplay = contributionDueDateDisplay(stage);
    if (stage.stageTypeWithDueDateDisplay === undefined) {
        if (stage.data && stage.data.DueDate) {
            stage.stageTypeWithDueDateDisplay = `${stage.stageTypeDisplay} due ${formatDate(stage.data.DueDate)}`;
        } else if (stage.data && stage.data.ClearanceDueDate) {
            stage.stageTypeWithDueDateDisplay = `${stage.stageTypeDisplay} due ${formatDate(stage.data.ClearanceDueDate)}`;
        } else {
            stage.stageTypeWithDueDateDisplay = stage.stageTypeDisplay;
        }
    }

    stage.primaryCorrespondentAndRefDisplay = {};
    stage.mpWithOwnerDisplay = JSON.parse('{"mp":"","owner":""}');
    stage.FOIRequesterDisplay = {};

    if (stage.correspondents && stage.correspondents.correspondents) {
        stage.memberCorrespondentDisplay = getCorrespondentsNameByType(stage.correspondents, ['MEMBER']);
        stage.applicantOrConstituentCorrespondentDisplay = getCorrespondentsNameByType(stage.correspondents, ['APPLICANT', 'CONSTITUENT']);

        const primaryCorrespondent =
            stage.correspondents.correspondents.find(correspondent => correspondent.is_primary === 'true');

        if (primaryCorrespondent) {
            stage.primaryCorrespondent = primaryCorrespondent;
            stage.primaryCorrespondentAndRefDisplay.primaryCorrespondentFullName = primaryCorrespondent.fullname;
            if (stage.caseType === 'FOI') {
                stage.FOIRequesterDisplay = primaryCorrespondent.fullname;
            }
        }

        stage.mpWithOwnerDisplay.mp = stage.memberCorrespondentDisplay;
    }

    stage.mpWithOwnerDisplay.owner = stage.assignedUserDisplay;

    stage.primaryCorrespondentAndRefDisplay.caseReference = stage.caseReference;

    if(stage.dueContribution){
        stage.nextContributionDueDate = (stage.contributions === 'Overdue') ? 'Overdue' : formatDate(stage.dueContribution);
    }

    return stage;
};

const contributionDueDateDisplay = ({ stageType, stageTypeDisplay, dueContribution, contributions }) => {
    const contributionReceivedStages = [
        'MPAM_TRIAGE',
        'MPAM_TRIAGE_ESCALATE',
        'MPAM_DRAFT',
        'MPAM_DRAFT_ESCALATE'
    ];

    const contributionRequestedStages = [
        'MPAM_TRIAGE_REQUESTED_CONTRIBUTION',
        'MPAM_TRIAGE_ESCALATED_REQUESTED_CONTRIBUTION',
        'MPAM_DRAFT_REQUESTED_CONTRIBUTION',
        'MPAM_DRAFT_ESCALATED_REQUESTED_CONTRIBUTION',
        'FOI_APPROVAL',
        'FOI_DRAFT'
    ];

    const receivedStatus = ['Received', 'Cancelled'];

    if (contributionRequestedStages.includes(stageType) && dueContribution) {
        return `${stageTypeDisplay} due: ${formatDate(dueContribution)}`;
    } else if (contributionReceivedStages.includes(stageType) && receivedStatus.includes(contributions)) {
        return `${stageTypeDisplay} (Contributions Received)`;
    }

    return undefined;
};

class Card {
    constructor({ label, value, type, count, overdue, unallocated }) {
        this.label = label;
        this.value = value;
        this.count = count || 0;
        this.type = type;
        this.tags = {
            overdue: overdue || 0,
            allocated: unallocated || 0
        };
    }
    incrementOverdue() { this.tags.overdue++; }
    incrementUnallocated() { this.tags.allocated++; }
    incrementCount() { this.count++; }
}

const dashboardAdapter = async (data, { fromStaticList, logger, configuration }) => {
    const dashboardData = await Promise.all(data.stages
        .map(bindDashboardElements(fromStaticList)));

    const userCard = dashboardData
        .reduce((card, stage) => {
            card.count += stage.statistics.usersCases;
            card.tags.overdue += configuration.deadlinesEnabled ? stage.statistics.usersOverdueCases : 0;
            return card;
        }, new Card({ label: 'Cases' }));

    const teamCards = dashboardData
        .reduce((cards, stage) => {
            cards.push(new Card({
                label: stage.teamName,
                value: stage.teamUuid,
                type: 'team',
                count: stage.statistics.cases,
                overdue: configuration.deadlinesEnabled ? stage.statistics.overdueCases : 0,
                unallocated: stage.statistics.unallocatedCases
            }));
            return cards;
        }, [])
        .sort(byLabel);
    logger.debug('REQUEST_DASHBOARD', { users: userCard, teams: teamCards.length });
    return { user: [userCard], teams: teamCards };
};

const bindDashboardElements = fromStaticList => async (stage) => {
    stage.teamName = await fromStaticList('S_ALL_TEAMS', stage.teamUuid);

    return stage;
};

const userAdapter = async (data, { fromStaticList, logger, configuration }) => {
    const workstackData = await Promise.all(data.stages
        .sort(defaultCaseSort)
        .map(bindDisplayElements(fromStaticList)));

    logger.debug('REQUEST_USER_WORKSTACK', { user_cases: workstackData.length });

    return {
        label: 'My Cases',
        items: workstackData,
        columns: returnMyCasesWorkstackColumns(configuration, workstackData),
        allocateToWorkstackEndpoint: '/unallocate/'
    };
};

const teamAdapter = async (data, { fromStaticList, logger, teamId, configuration }) => {
    const workstackData = await Promise.all(data.stages
        .sort(defaultCaseSort)
        .map(bindDisplayElements(fromStaticList)));
    const lastDay = subDays(Date.now(), 1);
    const workflowCards = workstackData
        .reduce((cards, stage) => {
            const index = cards.findIndex(({ value }) => value === stage.caseType);
            if (index >= 0) {
                const card = cards[index];
                card.incrementCount();
                if (isOverdue(configuration, stage.deadline, lastDay)) {
                    card.incrementOverdue();
                }
                if (isUnallocated(stage.userUUID)) {
                    card.incrementUnallocated();
                }
            } else {
                cards.push(new Card({
                    label: stage.caseTypeDisplayFull,
                    value: stage.caseType,
                    type: 'workflow',
                    count: 1,
                    overdue: isOverdue(configuration, stage.deadline, lastDay) ? 1 : 0,
                    unallocated: isUnallocated(stage.userUUID) ? 1 : 0
                }));
            }
            return cards;
        }, [])
        .sort(byLabel);
    const teamDisplayName = await fromStaticList('S_ALL_TEAMS', teamId);

    logger.debug('REQUEST_TEAM_WORKSTACK', { team: teamDisplayName, workflows: workflowCards.length, rows: workstackData.length });
    return {
        label: teamDisplayName,
        items: workstackData,
        columns: returnTeamWorkstackColumns(configuration, workstackData, teamId),
        dashboard: workflowCards,
        teamMembers: [],
        allocateToUserEndpoint: '/allocate/user',
        allocateToTeamEndpoint: '/allocate/team',
        allocateToWorkstackEndpoint: '/unallocate/'
    };
};

const workflowAdapter = async (data, { fromStaticList, logger, workflowId, configuration }) => {
    const workstackData = await Promise.all(data.stages
        .filter(stage => stage.caseType === workflowId)
        .sort(defaultCaseSort)
        .map(bindDisplayElements(fromStaticList)));
    const lastDay = subDays(Date.now(), 1);
    const stageCards = workstackData
        .reduce((cards, stage) => {
            const index = cards.findIndex(({ value }) => value === stage.stageType);
            if (index >= 0) {
                const card = cards[index];
                card.incrementCount();
                if (isOverdue(configuration, stage.deadline, lastDay)) {
                    card.incrementOverdue();
                }
                if (isUnallocated(stage.userUUID)) {
                    card.incrementUnallocated();
                }
            } else {
                cards.push(new Card({
                    label: stage.stageTypeDisplay,
                    value: stage.stageType,
                    type: 'stage',
                    count: 1,
                    overdue: isOverdue(configuration, stage.deadline, lastDay) ? 1 : 0,
                    unallocated: isUnallocated(stage.userUUID) ? 1 : 0
                }));
            }
            return cards;
        }, [])
        .sort(byLabel);
    const workflowDisplayName = await fromStaticList('S_CASETYPES', workflowId);
    logger.debug('REQUEST_WORKFLOW_WORKSTACK', { workflow: workflowDisplayName, stages: stageCards.length, rows: workstackData.length });
    return {
        label: workflowDisplayName,
        items: workstackData,
        columns: returnWorkstackColumns(configuration, workstackData),
        dashboard: stageCards,
        teamMembers: [],
        allocateToUserEndpoint: '/allocate/user',
        allocateToTeamEndpoint: '/allocate/team',
        allocateToWorkstackEndpoint: '/unallocate/'
    };
};
const stageAdapter = async (data, { fromStaticList, logger, workflowId, stageId, configuration }) => {
    const workstackData = await Promise.all(data.stages
        .filter(stage => stage.caseType === workflowId && stage.stageType === stageId)
        .sort(defaultCaseSort)
        .map(bindDisplayElements(fromStaticList)));
    const stageDisplayName = await fromStaticList('S_STAGETYPES', stageId);
    logger.debug('REQUEST_STAGE_WORKSTACK', { stage: stageDisplayName, rows: workstackData.length });
    return {
        label: await fromStaticList('S_STAGETYPES', stageId),
        items: workstackData,
        columns: returnWorkstackColumns(configuration, workstackData),
        teamMembers: [],
        allocateToUserEndpoint: '/allocate/user',
        allocateToTeamEndpoint: '/allocate/team',
        allocateToWorkstackEndpoint: '/unallocate/'
    };
};

module.exports = {
    dashboardAdapter,
    userAdapter,
    teamAdapter,
    workflowAdapter,
    stageAdapter,
    byTag,
    bindDisplayElements
};
