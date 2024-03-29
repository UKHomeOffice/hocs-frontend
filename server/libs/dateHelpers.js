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

/**
 * @param caseDeadline A date string in the form yyyy-MM-dd
 * @returns {boolean} true if the given date is today or later, else false
 */
function isDateTodayOrAfter(caseDeadline) {
    const startOfToday = new Date(Date.now()).setHours(0,0,0,0);
    const startOfCaseDeadlineDate = new Date(caseDeadline).setHours(0,0,0,0);

    return startOfCaseDeadlineDate.valueOf() >= startOfToday.valueOf();
}


const YEAR_RANGE = 120;

const MIN_ALLOWABLE_YEAR = (new Date().getFullYear() - YEAR_RANGE);

const MAX_ALLOWABLE_YEAR = (new Date().getFullYear() + YEAR_RANGE);

module.exports = { addDays, getUtcDateString, formatDate, isDateTodayOrAfter, MIN_ALLOWABLE_YEAR, MAX_ALLOWABLE_YEAR };
