export const ENDPOINT_SUCCEED_NO_REDIRECT = '/succeed/no/redirect';

export const mockRequestClientValidationError = Promise.resolve({
    data: {
        errors: {}
    }
}).catch((error) => {});
export const mockRequestClientNoRedirect = Promise.resolve({
    data: {
        redirect: ENDPOINT_SUCCEED_NO_REDIRECT
    }
}).catch((error) => {});
