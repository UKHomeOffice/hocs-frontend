const { formatDate } = require('./dateHelpers');

/**
 * Transforms deadline value if case is/has been suspended.
 *      Transform applied at this stage to allow Case Filter to be applied to filter on 'Suspended' and 'N/A'
 * @param {string} deadline - string value of the date in form yyyy-MM-dd
 * @param {boolean} isSuspended - flag to say if case is currently suspended.
 */
function resolveDeadlineDisplay(deadline, isSuspended) {
    return resolve(deadline, isSuspended, false);
}

/**
 * Transforms deadline value if case is/has been suspended.
 *      Transform applied at this stage to allow Case Filter to be applied to filter on 'Suspended' and 'N/A'.
 *      Where the case has never been suspended it will return a formatted version of the deadline.
 * @param {string} deadline - string value of the date in form yyyy-MM-dd
 * @param {boolean} isSuspended - flag to say if case is currently suspended.
 */
function resolveDeadlineDisplayWithDateFormatting(deadline, isSuspended) {
    return resolve(deadline, isSuspended,true);
}

function resolve(deadline, isSuspended, isFormatRequired) {
    switch (isSuspended) {
        case 'true':
            return 'Suspended';
        case 'false':
        default:
            if(deadline === '9999-12-31'){
                return 'N/A';
            }
            if(isFormatRequired) {
                return formatDate(deadline);
            }
            return deadline;
    }
}

module.exports = {
    resolveDeadlineDisplay,
    resolveDeadlineDisplayWithDateFormatting
};

