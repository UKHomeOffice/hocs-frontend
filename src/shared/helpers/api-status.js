const timeout = {
    ERROR: 10000,
    STANDARD: 1000
};

const status = {
    REQUEST_FORM: { display: 'Requesting form', level: 1, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_FORM_SUCCESS: { display: 'Form received', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_FORM_FAILURE: { display: 'Unable to fetch form', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    UPDATE_FORM_SUCCESS: { display: 'Form updated', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    UPDATE_FORM_FAILURE: { display: 'Form could not be updated', level: 3, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    SUBMIT_FORM: { display: 'Submitting form', level: 0, type: 'OK', timeoutPeriod: timeout.STANDARD },
    SUBMIT_FORM_SUCCESS: { display: 'Submitted form', level: 0, type: 'OK', timeoutPeriod: timeout.STANDARD },
    SUBMIT_FORM_FAILURE: { display: 'Unable to submit form', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    SUBMIT_FORM_VALIDATION_ERROR: { display: 'Form validation failed', level: 1, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    REQUEST_DOCUMENT_LIST: { display: 'Requesting document list', level: 1, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_DOCUMENT_LIST_SUCCESS: { display: 'Document list received', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_DOCUMENT_LIST_FAILURE: { display: 'Unable to fetch document list', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    REQUEST_CASE_NOTES: { display: 'Requesting case notes', level: 1, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_CASE_NOTES_SUCCESS: { display: 'Case notes received', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_CASE_NOTES_FAILURE: { display: 'Unable to fetch case notes', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    REQUEST_CASE_SUMMARY: { display: 'Requesting case summary', level: 1, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_CASE_SUMMARY_SUCCESS: { display: 'Case summary received', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_CASE_SUMMARY_FAILURE: { display: 'Unable to fetch case summary', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    REQUEST_DASHBOARD_DATA: { display: 'Requesting dashboard', level: 1, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_DASHBOARD_DATA_SUCCESS: { display: 'Dashboard data received', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_DASHBOARD_DATA_FAILURE: { display: 'Unable to fetch dashboard', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    UPDATE_DASHBOARD_DATA_SUCCESS: { display: 'Updating dashboard', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    UPDATE_DASHBOARD_DATA_FAILURE: { display: 'Failed to update dashboard', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    REQUEST_WORKSTACK_DATA: { display: 'Requesting workstack', level: 1, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_WORKSTACK_DATA_SUCCESS: { display: 'Workstack data received', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    REQUEST_WORKSTACK_DATA_FAILURE: { display: 'Unable to fetch workstack', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
    UPDATE_WORKSTACK_DATA_SUCCESS: { display: 'Updating workstack', level: 3, type: 'OK', timeoutPeriod: timeout.STANDARD },
    UPDATE_WORKSTACK_DATA_FAILURE: { display: 'Failed to update workstack', level: 0, type: 'ERROR', timeoutPeriod: timeout.ERROR },
};

export default status;