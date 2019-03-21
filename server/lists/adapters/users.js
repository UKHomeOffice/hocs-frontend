const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = (data, { options }) => data
    .filter(u => u.email !== options.user.email)
    .map(({ id, firstName, lastName, email }) => ({
        label: `${firstName} ${lastName} (${email})`,
        value: id
    }))
    .sort(byLabel);