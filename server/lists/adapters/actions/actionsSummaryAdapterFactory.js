const appealAdaptor = require('./appealsSummaryAdapter');
const extensionAdaptor = require('./extensionsSummaryAdapter');
const externalInterestAdaptor = require('./externalInterestsSummaryAdapter');
const suspensionsAdapter = require('./suspensionsAdaptor');

const actionSummaryAdapterFactory = {
    appeals: appealAdaptor,
    extensions: extensionAdaptor,
    recordInterest: externalInterestAdaptor,
    suspensions: suspensionsAdapter
};

module.exports = {
    actionSummaryAdapterFactory
};