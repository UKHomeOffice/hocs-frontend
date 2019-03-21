const byUser = (userId) => ({ userUUID }) => userUUID === userId;
const byCaseReference = (a, b) => a.caseReference.localeCompare(b.caseReference);
const isUnallocated = user => user === null;
const isOverdue = deadline => deadline && new Date(deadline) < Date.now();
const getOverdue = data => {
    const overdueCases = data.filter(({ deadline }) => isOverdue(deadline));
    return overdueCases.length > 0 ? overdueCases.count : null;
};

const formatDate = (date) => date ? Intl.DateTimeFormat('en-GB').format(new Date(date)) : null;

const bindDisplayElements = fromStaticList => async (stage) => {
    stage.assignedTeamDisplay = await fromStaticList('S_TEAMS', stage.teamUUID);
    stage.caseTypeDisplayFull = await fromStaticList('S_CASETYPES', stage.caseType);
    stage.stageTypeDisplay = await fromStaticList('S_STAGETYPES', stage.stageType);
    if (stage.userUUID) {
        stage.assignedUserDisplay = await fromStaticList('S_USERS', stage.userUUID) || 'Allocated';
    }
    stage.deadlineDisplay = formatDate(stage.deadline);
    return stage;
};

class Card {
    constructor({ label, value, type, count, overdue, unallocated }) {
        this.label = label;
        this.value = value;
        this.count = count || 1;
        this.type = type;
        this.tags = {
            overdue: overdue,
            allocated: unallocated
        };
    }
    incrementOverdue() { this.tags.overdue++; }
    incrementUnallocated() { this.tags.allocted++; }
    incrementCount() { this.count++; }
}

const dashboardAdapter = async (data, { fromStaticList, user }) => {
    const dashboardData = await Promise.all(data.stages
        .map(bindDisplayElements(fromStaticList)));
    const userCard = [new Card({
        label: 'Cases',
        count: dashboardData.filter(byUser(user.uuid)).length,
        overdue: getOverdue(dashboardData)
    })];
    const teamCards = dashboardData
        .reduce((cards, stage) => {
            const index = cards.findIndex(({ value }) => value === stage.teamUUID);
            if (index >= 0) {
                const card = cards[index];
                card.incrementCount();
                if (isOverdue(stage.deadline)) {
                    card.incrementOverdue();
                }
                if (isUnallocated(stage.userUUID)) {
                    card.incrementUnallocated();
                }
            } else {
                cards.push(new Card({
                    label: stage.assignedTeamDisplay,
                    value: stage.teamUUID,
                    type: 'team',
                    overdue: isOverdue(stage.deadline) ? 1 : 0,
                    unallocated: isUnallocated(stage.userUUID) ? 1 : 0
                }));
            }
            return cards;
        }, [])
        .sort((a, b) => a.label.localeCompare(b.label));
    return { user: userCard, teams: teamCards };
};

const userAdapter = async (data, { fromStaticList, user }) => {
    const workstackData = await Promise.all(data.stages
        .filter(stage => stage.userUUID === user.uuid)
        .sort(byCaseReference)
        .map(bindDisplayElements(fromStaticList)));
    return {
        label: 'My Cases',
        items: workstackData,
        allocateToWorkstackEndpoint: '/unallocate/'
    };
};

const teamAdapter = async (data, { fromStaticList, teamId }) => {
    const workstackData = await Promise.all(data.stages
        .filter(stage => stage.teamUUID === teamId)
        .sort(byCaseReference)
        .map(bindDisplayElements(fromStaticList)));
    const workflowCards = workstackData
        .reduce((cards, stage) => {
            const index = cards.findIndex(({ value }) => value === stage.caseType);
            if (index >= 0) {
                const card = cards[index];
                card.incrementCount();
                if (isOverdue(stage.deadline)) {
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
                    overdue: isOverdue(stage.deadline) ? 1 : 0,
                    unallocated: isUnallocated(stage.userUUID) ? 1 : 0
                }));
            }
            return cards;
        }, []);
    return {
        label: await fromStaticList('S_TEAMS', teamId),
        items: workstackData,
        dashboard: workflowCards,
        teamMembers: [],
        allocateToUserEndpoint: '/allocate/user',
        allocateToTeamEndpoint: '/allocate/team',
        allocateToWorkstackEndpoint: '/unallocate/'
    };
};

const workflowAdapter = async (data, { fromStaticList, teamId, workflowId }) => {
    const workstackData = await Promise.all(data.stages
        .filter(stage => stage.teamUUID === teamId && stage.caseType === workflowId)
        .sort(byCaseReference)
        .map(bindDisplayElements(fromStaticList)));
    const stageCards = workstackData
        .reduce((cards, stage) => {
            const index = cards.findIndex(({ value }) => value === stage.stageType);
            if (index >= 0) {
                const card = cards[index];
                card.incrementCount();
                if (isOverdue(stage.deadline)) {
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
                    overdue: isOverdue(stage.deadline) ? 1 : 0,
                    unallocated: isUnallocated(stage.userUUID) ? 1 : 0
                }));
            }
            return cards;
        }, []);
    return {
        label: await fromStaticList('S_CASETYPES', workflowId),
        items: workstackData,
        dashboard: stageCards,
        teamMembers: [],
        allocateToUserEndpoint: '/allocate/user',
        allocateToTeamEndpoint: '/allocate/team',
        allocateToWorkstackEndpoint: '/unallocate/'
    };
};
const stageAdapter = async (data, { fromStaticList, teamId, workflowId, stageId }) => {
    const workstackData = await Promise.all(data.stages
        .filter(stage => stage.teamUUID === teamId && stage.caseType === workflowId && stage.stageType === stageId)
        .sort(byCaseReference)
        .map(bindDisplayElements(fromStaticList)));
    return {
        label: await fromStaticList('S_STAGETYPES', stageId),
        items: workstackData,
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
    stageAdapter
};