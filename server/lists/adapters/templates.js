module.exports = async (data) => {
    return data
        .map(({ displayName, uuid }) => ({
            label: displayName,
            value: uuid
        }))
};