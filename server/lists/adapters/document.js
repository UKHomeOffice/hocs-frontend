module.exports = data => data.documents
    .sort((a, b) => Date.parse(a.created) > Date.parse(b.created))
    .map(({ displayName, uuid }) => ({ label: displayName, value: uuid }));