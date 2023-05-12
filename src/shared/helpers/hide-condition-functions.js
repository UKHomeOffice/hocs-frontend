function hasNoContributionsOrFulfilled(data) {
    if (!data.CaseContributions) {
        return true;
    }

    try {
        const contributions = JSON.parse(data.CaseContributions);

        if (!Array.isArray(contributions)) {
            return true;
        }

        return contributions.filter(contribution => !contribution.data.contributionStatus).length === 0;
    } catch (_) {
        // If the CaseContributions is not a valid JSON we return true
        return true;
    }
}

function hasAnyValue(data, conditionArgs) {
    if (data && data[conditionArgs.conditionPropertyName]) {
        return false;
    }
    return true;
}

module.exports = {
    hasAnyValue,
    hasNoContributionsOrFulfilled
};
