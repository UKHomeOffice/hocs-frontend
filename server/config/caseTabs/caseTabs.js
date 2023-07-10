const config = require('./config.json');
const User = require('../../models/user');

const fetchCaseTabsForCaseType = (caseType) => {
    return config[caseType] ?? [];
};

const fetchCaseTabsForCaseTypeAndUser = (caseType, user) => {
    return fetchCaseTabsForCaseType(caseType).filter(caseTab => caseTab.required_role ? User.hasRole(user, caseTab.required_role) : true);
};

module.exports = {
    fetchCaseTabsForCaseType,
    fetchCaseTabsForCaseTypeAndUser
};
