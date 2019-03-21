const byLabel = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase());

module.exports = data => data.members
    .sort(byLabel)
    .reduce((groups, member) => {
        const groupIndex = groups.findIndex(({ label }) => label === member.group);
        if (groupIndex >= 0) {
            groups[groupIndex].options.push({ label: member.label, value: member.value });
        } else {
            groups.push({
                label: member.group, options: [{
                    label: member.label, value: member.value
                }]
            });
        }
        return groups;
    }, []);