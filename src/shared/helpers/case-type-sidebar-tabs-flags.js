
const allCaseTypes = {
    documents: true,
    summary: true,
    timeline: true,
    people: true
};

const caseTypeSidebarTabsFlags = {
    WCS: {
        people: false
    },
    FOI: {
        people: false,
        case_actions: true
    },
    BF: {
        case_actions: true,
        ex_gratia: true
    },
    BF2: {
        case_actions: true,
        ex_gratia: true
    },
    SMC: {
        case_actions: true
    }
};

module.exports = (caseType) => {

    if (!caseType) {
        return {};
    }

    if (!Object.keys(caseTypeSidebarTabsFlags).includes(caseType)) {
        return { ...allCaseTypes };
    }

    const caseSpecificTabs = caseTypeSidebarTabsFlags[caseType];
    return { ...allCaseTypes, ...caseSpecificTabs };
};
