const { Choice } = require('../../services/forms/component-builder');

const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_CASE_TYPES', { caseTypes: data.caseTypes.length });
    return data.caseTypes
        .sort(byLabel)
        .map(({ label, value }) => Choice(label, value));
};
