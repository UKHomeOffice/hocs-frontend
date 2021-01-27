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

const parseDate = (rawDate) => {
    const [date] = rawDate.match(/\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/g) || [];
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};
const formatDate = (date) => date ? parseDate(date) : null;

module.exports = { addDays, getUtcDateString, formatDate };
