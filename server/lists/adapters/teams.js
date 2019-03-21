const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = data => data
    .map(({ displayName, type }) => ({
        label: displayName,
        value: type
    }))
    .sort(byLabel);