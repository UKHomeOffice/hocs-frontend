const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
};

// Returns today's date in format (yyyy-MM-dd)
const getUtcDateString = (date) => {
    if (date && date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return undefined;
};

module.exports = { addDays, getUtcDateString };
