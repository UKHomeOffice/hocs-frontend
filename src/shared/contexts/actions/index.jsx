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

export function setPhase(phase) {
    return {
        type: types.SET_PHASE,
        payload: phase
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