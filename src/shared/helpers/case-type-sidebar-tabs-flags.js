
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
        foi_actions: true
    },
    BF: {
        foi_actions: true,
        ex_gratia: true
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
