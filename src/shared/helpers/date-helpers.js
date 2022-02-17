/**
 * @param caseDeadline A date string in the form yyyy-MM-dd
 * @returns {boolean} true if the given date is today or later, else false
 */
function isDateTodayOrAfter(caseDeadline) {
    const startOfToday = new Date(Date.now()).setHours(0,0,0,0);
    const startOfCaseDeadlineDate = new Date(caseDeadline).setHours(0,0,0,0);

    return startOfCaseDeadlineDate.valueOf() >= startOfToday.valueOf();
}

export {
    isDateTodayOrAfter
};
