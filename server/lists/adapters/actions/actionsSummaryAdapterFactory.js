const appealAdaptor = require('./appealsSummaryAdapter');
const externalInterestAdaptor = require('./externalInterestsSummaryAdapter');

const actionSummaryAdapterFactoryType = {
    appeals: appealAdaptor,
    recordInterest: externalInterestAdaptor,
};

const actionSummaryAdapterFactory = async (type, caseActions, fetchList ) => {

    const adapter = actionSummaryAdapterFactoryType[type];
    if (adapter != null) {
        return adapter.call(this, caseActions, fetchList);
    }
    return caseActions;
};

module.exports = {
    actionSummaryAdapterFactory
};

