const config = require('./config.json');

const defaultConfig = {
    displayAsFields: false,
    displayAll: false,
    displayHeading: true
};

const fetchUnallocatedConfigurationForCaseType = (caseType) =>
    Object.assign({}, defaultConfig, config[caseType]);

module.exports = fetchUnallocatedConfigurationForCaseType;
