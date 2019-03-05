import types from './types.jsx';

export function updateForm(form) {
    return {
        type: types.UPDATE_FORM,
        payload: form
    };
}

export function updateFormData(data) {
    return {
        type: types.UPDATE_FORM_DATA,
        payload: data
    };
}

export function updateFormErrors(data) {
    return {
        type: types.UPDATE_FORM_ERRORS,
        payload: data
    };
}

export function setError(error) {
    return {
        type: types.SET_ERROR,
        payload: error
    };
}

export function unsetError() {
    return {
        type: types.UNSET_ERROR,
    };
}

export function unsetForm() {
    return {
        type: types.UNSET_FORM,
    };
}

export function updateLocation(location) {
    return {
        type: types.UPDATE_LOCATION,
        payload: location
    };
}

export function cancel() {
    return {
        type: types.CANCEL
    };
}

export function redirected() {
    return {
        type: types.REDIRECTED
    };
}

export function redirect(url) {
    return {
        type: types.REDIRECT,
        payload: url
    };
}

export function updateApiStatus(status) {
    return {
        type: types.UPDATE_API_STATUS,
        payload: {
            status,
            timeStamp: Date.now()
        }
    };
}

export function clearApiStatus() {
    return {
        type: types.CLEAR_API_STATUS
    };
}

export function updatePageMeta(meta) {
    return {
        type: types.UPDATE_PAGE_META,
        payload: meta
    };
}

export function updateDashboard(data) {
    return {
        type: types.UPDATE_DASHBOARD,
        payload: data
    };
}

export function clearDashboard() {
    return {
        type: types.CLEAR_DASHBOARD,
        payload: null
    };
}

export function updateWorkstack(data) {
    return {
        type: types.UPDATE_WORKSTACK,
        payload: data
    };
}

export function clearWorkstack() {
    return {
        type: types.CLEAR_WORKSTACK,
        payload: null
    };
}

export function unsetCaseSummary() {
    return {
        type: types.UNSET_CASE_SUMMARY,
        payload: null
    };
}

export function unsetCaseNotes() {
    return {
        type: types.UNSET_CASE_NOTES,
        payload: null
    };
}

export function passForwardProps(props) {
    return {
        type: types.PASS_FORWARD_PROPS,
        payload: props
    };
}