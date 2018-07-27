export const ENDPOINT_SUCCEED = '/succeed';
export const ENDPOINT_SUCCEED_VALIDATION_ERROR = '/succeed/validation';
export const ENDPOINT_SUCCEED_NO_REDIRECT = '/succeed/no/redirect';
export const ENDPOINT_FAIL = '/fail';
export const MULTIPART_FORM_HEADER = {
    headers: { 'Content-Type': 'multipart/form-data' }
};

export const mockRequestClientSuccess = Promise.resolve({
    data: {}
});
export const mockRequestClientValidationError = Promise.resolve({
    data: {
        errors: {}
    }
});
export const mockRequestClientNoRedirect = Promise.resolve({
    data: {
        redirect: ENDPOINT_SUCCEED_NO_REDIRECT
    }
});
export const mockRequestClientFailure = Promise.reject({
    response: {
        data: {
        }
    }
});