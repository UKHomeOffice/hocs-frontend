const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = async (data) => data
    .map(({ displayName, type }) => ({
        label: displayName,
        value: type
    }))
    .sort(byLabel);