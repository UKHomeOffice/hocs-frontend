const status = {
    REQUEST_FORM: { display: 'Requesting form', level: 1, type: 'OK' },
    REQUEST_FORM_SUCCESS: { display: 'Form received', level: 3, type: 'OK' },
    REQUEST_FORM_FAILURE: { display: 'Unable to fetch form', level: 0, type: 'ERROR' },
    UPDATE_FORM_SUCCESS: { display: 'Form updated', level: 3, type: 'OK' },
    UPDATE_FORM_FAILURE: { display: 'Form could not be updated', level: 3, type: 'ERROR' },
    SUBMIT_FORM: { display: 'Submitting form', level: 0, type: 'OK' },
    SUBMIT_FORM_SUCCESS: { display: 'Submitted form', level: 0, type: 'OK' },
    SUBMIT_FORM_FAILURE: { display: 'Unable to submit form', level: 0, type: 'ERROR' },
    SUBMIT_FORM_VALIDATION_ERROR: { display: 'Form validation failed', level: 1, type: 'ERROR' },
    REQUEST_DOCUMENT_LIST: { display: 'Requesting document list', level: 1, type: 'OK' },
    REQUEST_DOCUMENT_LIST_SUCCESS: { display: 'Document list received', level: 3, type: 'OK' },
    REQUEST_DOCUMENT_LIST_FAILURE: { display: 'Unable to fetch document list', level: 0, type: 'ERROR' }
};

export default status;