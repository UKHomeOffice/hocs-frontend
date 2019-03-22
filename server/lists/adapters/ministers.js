const byLabel = (a, b) => a.label.localeCompare(b.label);

module.exports = async (data) => data.ministers.sort(byLabel);