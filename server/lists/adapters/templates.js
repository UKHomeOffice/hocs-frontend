module.exports = async (data) => {
    return data
        .map(({ displayName, documentUUID }) => ({
            label: displayName,
            value: documentUUID
        }));
};