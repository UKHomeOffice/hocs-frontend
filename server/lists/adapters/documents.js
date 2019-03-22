module.exports = async (data) => {
    return data.documents
        .sort((a, b) => Date.parse(a.created) > Date.parse(b.created) ? 1 : 0)
        .map(({ displayName, uuid }) => ({ label: displayName, value: uuid }));
};