const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = async (data, { user, logger }) => {
    logger.debug('REQUEST_USERS', { users: data.length });
    return data
        .filter(u => u.id !== user.id)
        .map(({ id, firstName, lastName, email }) => ({
            label: `${firstName} ${lastName} (${email})`,
            value: id
        }))
        .sort(byLabel);
};