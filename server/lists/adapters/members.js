const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = async (data, { logger }) => {
    logger.debug('REQUEST_MEMBERS', { members: data.members.length });
    return data.members
        .sort(byLabel)
        .reduce((groups, { group, label, value }) => {
            const groupIndex = groups.findIndex(({ label }) => label === group);
            if (groupIndex >= 0) {
                groups[groupIndex].options.push({ label, value });
            } else {
                groups.push({
                    label: group, options: [{
                        label,
                        value
                    }]
                });
            }
            return groups;
        }, []);
};