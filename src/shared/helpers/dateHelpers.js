/**
 * @param caseDeadline A date string in the form yyyy-MM-dd
 * @returns {boolean} true if the given date is today or later, else false
 */
function isDateTodayOrAfter(caseDeadline) {
    const startOfToday = new Date(Date.now()).setHours(0,0,0,0);
    const startOfCaseDeadlineDate = new Date(caseDeadline).setHours(0,0,0,0);

    return startOfCaseDeadlineDate.valueOf() >= startOfToday.valueOf();
}

const parseIso8601Date = (rawDate = '') => {
    const [date, year, month, day] = rawDate.match(/^(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/) || [];
    return !date ? null : `${day}/${month}/${year}`;
};

const addDaysToDate = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
};

export {
    addDaysToDate,
    isDateTodayOrAfter,
    parseIso8601Date,
};
