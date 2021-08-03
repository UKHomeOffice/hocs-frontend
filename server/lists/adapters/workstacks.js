const { addDays, formatDate } = require('../../libs/dateHelpers');

const byCaseReference = (a, b) => a.caseReference.localeCompare(b.caseReference);

const byPriority = (a, b) => {
    if (a.data.systemCalculatedPriority == undefined || b.data.systemCalculatedPriority == undefined) {
        return 0;
    } else {
        var aFloat = parseFloat(a.data.systemCalculatedPriority);
        var bFloat = parseFloat(b.data.systemCalculatedPriority);

        if (aFloat == bFloat) {
            return 0;
        }
        if (aFloat > bFloat) {
            return -1;
        }
        return 1;
    }
};

const byWorkable = (stage) => {
    if (stage.data) {
        if (stage.data.Unworkable) {
            if (stage.data.Unworkable === 'True') {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    } else {
        return 1;
    }
};

const defaultCaseSort = (a, b) => {
    var sortResult = byPriority(a, b);
    if (sortResult == 0) {
        sortResult = byCaseReference(a, b);
    }
    return sortResult;
};
const byLabel = (a, b) => a.label.localeCompare(b.label);
const isUnallocated = user => user === null;

const isOverdue = (configuration, deadline) =>
    configuration.deadlinesEnabled &&
    deadline &&
    addDays(deadline, 1) < Date.now();

const returnWorkstackColumns = (configuration, workstackData) => {
    const defaultColumnConfig = 'DEFAULT';
    const caseTypeForColumnConfig = workstackData.length > 0 ? workstackData[0].caseType : defaultColumnConfig;

    var getColumnsForWorkstack = configuration.workstackTypeColumns.find(
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
    var getColumnsForWorkstack = configuration.workstackTypeColumns.find(
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

    var getColumnsForMyCases = configuration.workstackTypeColumns.find(
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

const highestPriorityContributionStatus = (decoratedContributions) => {
    const contributionStatusEnum = {
        '': 0,
        'contributionReceived': 1,
        'contributionCancelled': 2,
        'contributionDue': 3,
        'contributionOverdue': 4
    };
    let highestPriority = 0;

    decoratedContributions.forEach(contribution => {
        if (contributionStatusEnum[contribution.contributionStatus] > highestPriority) {
            highestPriority = contributionStatusEnum[contribution.contributionStatus];
        }
    });
    return Object.keys(contributionStatusEnum).find(key => contributionStatusEnum[key] === highestPriority);
};

const decorateContributionsWithStatus = (contributions, currentDate) => {
    return contributions.map(contribution => {
        const contributionObject = JSON.parse(contribution);
        if (contributionObject.contributionStatus !== 'contributionReceived' && contributionObject.contributionStatus !== 'contributionCancelled') {
            if (addDays(new Date(contributionObject.contributionDueDate), 1) < currentDate) {
                contributionObject['contributionStatus'] = 'contributionOverdue';
            } else {
                contributionObject['contributionStatus'] = 'contributionDue';
            }
        }
        return contributionObject;
    });
};

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
        stage.campaignDisplay = await fromStaticList('S_MPAM_CAMPAIGNS', stage.data.CampaignType, true) || stage.data.CampaignType;
    }
    if (stage.data && stage.data.MinSignOffTeam) {
        stage.MinSignOffTeamDisplay = await fromStaticList('S_MPAM_MIN_SIGN_OFF_TEAMS', stage.data.MinSignOffTeam, true) || stage.data.MinSignOffTeam;
    }
    stage.deadlineDisplay = formatDate(stage.deadline);

    stage.stageTypeWithDueDateDisplay = stage.stageTypeDisplay;
    if (stage.data) {
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
            'MPAM_DRAFT_ESCALATED_REQUESTED_CONTRIBUTION'
        ];

        if (stage.data.CaseContributions &&
            (contributionReceivedStages.includes(stage.stageType) || contributionRequestedStages.includes(stage.stageType))) {
            const dueContribution = JSON.parse(stage.data.CaseContributions)
                .filter(contribution => contribution.data && !contribution.data.contributionStatus)
                .map(contribution => contribution.data.contributionDueDate)
                .sort()
                .shift();

            if (contributionRequestedStages.includes(stage.stageType) && dueContribution) {
                stage.stageTypeWithDueDateDisplay = `${stage.stageTypeDisplay} due: ${formatDate(dueContribution)}`;
            } else if (contributionReceivedStages.includes(stage.stageType) && !dueContribution) {
                stage.stageTypeWithDueDateDisplay = `${stage.stageTypeDisplay} (Contributions Received)`;
            } else {
                stage.stageTypeWithDueDateDisplay = stage.stageTypeDisplay;
            }
        } else if (stage.data.DueDate) {
            stage.stageTypeWithDueDateDisplay = `${stage.stageTypeDisplay} due ${formatDate(stage.data.DueDate)}`;
        }
    }

    if (stage.somu && stage.somu.caseContributions) {
        stage.contributions = highestPriorityContributionStatus(
            decorateContributionsWithStatus(stage.somu.caseContributions, new Date())).replace('contribution', '');
    }

    stage.primaryCorrespondentAndRefDisplay = {};
    stage.mpWithOwnerDisplay = JSON.parse('{"mp":"","owner":""}');

    if (stage.correspondents && stage.correspondents.correspondents) {
        stage.memberCorrespondentDisplay = getCorrespondentsNameByType(stage.correspondents, ['MEMBER']);
        stage.applicantOrConstituentCorrespondentDisplay = getCorrespondentsNameByType(stage.correspondents, ['APPLICANT', 'CONSTITUENT']);

        const primaryCorrespondent =
            stage.correspondents.correspondents.find(correspondent => correspondent.is_primary === 'true');

        if (primaryCorrespondent) {
            stage.primaryCorrespondent = primaryCorrespondent;
            stage.primaryCorrespondentAndRefDisplay.primaryCorrespondentFullName = primaryCorrespondent.fullname;
        }

        stage.mpWithOwnerDisplay.mp = stage.memberCorrespondentDisplay;
    }

    stage.mpWithOwnerDisplay.owner = stage.assignedUserDisplay;

    stage.primaryCorrespondentAndRefDisplay.caseReference = stage.caseReference;

    return stage;
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
    getCount() { return this.count; }
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
        .sort((a, b) => (a.label && b.label) ? a.label.localeCompare(b.label) : 0);
    logger.debug('REQUEST_DASHBOARD', { users: userCard, teams: teamCards.length });
    return { user: [userCard], teams: teamCards };
};

const bindDashboardElements = fromStaticList => async (stage) => {
    stage.teamName = await fromStaticList('S_TEAMS', stage.teamUuid);

    return stage;
};

const userAdapter = async (data, { fromStaticList, logger, user, configuration }) => {
    const workstackData = await Promise.all(data.stages
        .filter(byWorkable)
        .filter(stage => stage.userUUID === user.uuid)
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
        .filter(byWorkable)
        .filter(stage => stage.teamUUID === teamId)
        .sort(defaultCaseSort)
        .map(bindDisplayElements(fromStaticList)));
    const workflowCards = workstackData
        .reduce((cards, stage) => {
            const index = cards.findIndex(({ value }) => value === stage.caseType);
            if (index >= 0) {
                const card = cards[index];
                card.incrementCount();
                if (isOverdue(configuration, stage.deadline)) {
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
                    overdue: isOverdue(configuration, stage.deadline) ? 1 : 0,
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

const workflowAdapter = async (data, { fromStaticList, logger, teamId, workflowId, configuration }) => {
    const workstackData = await Promise.all(data.stages
        .filter(byWorkable)
        .filter(stage => stage.teamUUID === teamId && stage.caseType === workflowId)
        .sort(defaultCaseSort)
        .map(bindDisplayElements(fromStaticList)));
    const stageCards = workstackData
        .reduce((cards, stage) => {
            const index = cards.findIndex(({ value }) => value === stage.stageType);
            if (index >= 0) {
                const card = cards[index];
                card.incrementCount();
                if (isOverdue(configuration, stage.deadline)) {
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
                    overdue: isOverdue(configuration, stage.deadline) ? 1 : 0,
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
const stageAdapter = async (data, { fromStaticList, logger, teamId, workflowId, stageId, configuration }) => {
    const workstackData = await Promise.all(data.stages
        .filter(byWorkable)
        .filter(stage => stage.teamUUID === teamId && stage.caseType === workflowId && stage.stageType === stageId)
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
    bindDisplayElements,
    decorateContributionsWithStatus,
    highestPriorityContributionStatus
};
