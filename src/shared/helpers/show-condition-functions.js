function hasCommaSeparatedValue(data, conditionArgs) {
    function checkPair(conditionArgPair) {
        if (!data || !data[conditionArgPair.conditionPropertyName]) {
            return false;
        }

        const dataPropertyValue = data[conditionArgPair.conditionPropertyName];

        if (Array.isArray(dataPropertyValue)) {
            return dataPropertyValue.includes(conditionArgPair.conditionPropertyValue);
        }

        return dataPropertyValue.split(',').includes(conditionArgPair.conditionPropertyValue);
    }

    for(const conditionArgPair in conditionArgs) {
        if(!checkPair(conditionArgs[conditionArgPair])) return false;
    }

    return true;
}

function hasAllValues(data, conditionArgs) {
    console.log('test');
    for(const conditionArgPair in conditionArgs) {
        if (!(data && data[conditionArgs[conditionArgPair].conditionPropertyName]
                && data[conditionArgs[conditionArgPair].conditionPropertyName]
                    === conditionArgs[conditionArgPair].conditionPropertyValue)) {
            return false;
        }
    }

    return true;
}


module.exports = {
    hasCommaSeparatedValue,
    hasAllValues
};
