const appealAdaptor = require('./appealsSummaryAdapter');
const extensionAdaptor = require('./extensionsSummaryAdapter');

const actionSummaryAdapterFactory = {
    appeals: appealAdaptor,
    extensions: extensionAdaptor
};

module.exports = {
    actionSummaryAdapterFactory
};