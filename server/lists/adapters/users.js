const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = async (data, { user }) => data
    .filter(u => u.id !== user.id)
    .map(({ id, firstName, lastName, email }) => ({
        label: `${firstName} ${lastName} (${email})`,
        value: id
    }))
    .sort(byLabel);