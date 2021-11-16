const appealAdaptor = require('./appealsSummaryAdapter');
const extensionAdaptor = require('./extensionsSummaryAdapter');
const externalInterestAdaptor = require('./externalInterestSummaryAdapter');

const actionSummaryAdapterFactory = {
    appeals: appealAdaptor,
    extensions: extensionAdaptor,
    recordInterest: externalInterestAdaptor
};

module.exports = {
    actionSummaryAdapterFactory
};