const appealAdaptor = require('./appealsSummaryAdapter');
const extensionAdaptor = require('./extensionsSummaryAdapter');
const externalInterestAdaptor = require('./externalInterestsSummaryAdapter');

const actionSummaryAdapterFactory = {
    appeals: appealAdaptor,
    extensions: extensionAdaptor,
    recordInterest: externalInterestAdaptor
};

module.exports = {
    actionSummaryAdapterFactory
};