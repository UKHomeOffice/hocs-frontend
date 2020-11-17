const reducer = (state, action) => {
    switch (action.type) {
        case 'PopulateStandardLines':
            return { ...state, allStandardLines: action.payload, activeStandardLines: filterLines(action.payload, state.filter.toUpperCase(), state.excludeExpired), standardLinesLoaded: true };
        case 'FilterStandardLines':
            return { ...state, filter: action.payload, activeStandardLines: filterLines(state.allStandardLines, action.payload.toUpperCase(), state.excludeExpired) };
        case 'ExcludeExpiredCheckTrigger':
            return { ...state, excludeExpired: action.payload, activeStandardLines: filterLines(state.allStandardLines, state.filter.toUpperCase(), action.payload) };
    }
    return state;
};

const filterLines = (standardLines, filter, excludeExpired) => {
    let filteredStandardLines = standardLines;
    if (standardLines && filter) {
        filteredStandardLines = [];
        for (let i = 0; i < standardLines.length; i += 1) {
            const standardLine = standardLines[i];
            if (doesFilterMatchValue(standardLine.topic, filter) || doesFilterMatchValue(standardLine.displayName, filter)
                || doesFilterMatchValue(standardLine.expiryDate, filter) || doesFilterMatchValue(standardLine.team, filter)) {
                filteredStandardLines.push(standardLine);
            }
        }
    }
    return excludeExpired ? removeExpiredStarndardLines(filteredStandardLines) : filteredStandardLines;
};

const doesFilterMatchValue = (value, filter) => {
    return value && filter && value.toUpperCase && value.toUpperCase().indexOf(filter) !== -1;
};

const removeExpiredStarndardLines = (standardLines) => {
    if (standardLines) {
        const filteredStandardLines = [];
        for (let i = 0; i < standardLines.length; i += 1) {
            const standardLine = standardLines[i];
            if (!standardLine.isExpired) {
                filteredStandardLines.push(standardLine);
            }
        }
        return filteredStandardLines;
    }
    return standardLines;
};

export default reducer;