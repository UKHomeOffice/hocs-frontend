function hasCommaSeparatedValue(data, propertyName, propertyValue) {
    if (!data || !data[propertyName]) {
        return false;
    }

    const dataPropertyValue = data[propertyName];

    if (Array.isArray(dataPropertyValue)) {
        return dataPropertyValue.includes(propertyValue);
    }

    return dataPropertyValue.split(',').includes(propertyValue);
}

module.exports = {
    hasCommaSeparatedValue
};
