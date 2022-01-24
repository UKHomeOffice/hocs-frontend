const appealAdaptor = require('./appealsSummaryAdapter');
const extensionAdaptor = require('./extensionsSummaryAdapter');
const externalInterestsAdaptor = require('./externalInterestsSummaryAdapter');

const actionSummaryAdapterFactory = {
    appeals: appealAdaptor,
    extensions: extensionAdaptor,
    recordInterest: externalInterestsAdaptor
};

module.exports = {
    actionSummaryAdapterFactory
};