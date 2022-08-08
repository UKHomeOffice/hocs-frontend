const config = require('./config.json');

const fetchCaseTabsForCaseType = (caseType) => {
    return config[caseType] ?? [];
};

module.exports = {
    fetchCaseTabsForCaseType
};
