const config = require('./config.json');

const defaultConfigModal = {
    displayName: 'Correspondence System',
    bulkCreate: false,
    deadlines: false,
    autoCreateAndAllocate: false,
    viewStandardLines: false
};

const fetchTenantConfiguration = (tenant) => config[tenant] ?? defaultConfigModal;

module.exports = {
    fetchTenantConfiguration
};
