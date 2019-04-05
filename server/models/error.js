const { isProduction } = require('../config');

class ErrorModel extends Error {

    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || 500;
    }

    toJSON() {
        return {
            status: this.status,
            title: this.title,
            message: this.message,
            stack: isProduction ? null : this.stack
        };
    }

}

class AuthenticationError extends ErrorModel {
    constructor(message, status = 403) {
        super(message, status, 'Authentication error');
    }
}

class ActionError extends ErrorModel {
    constructor(message, status = 500) {
        super(message, status);
    }
}

class FormSubmissionError extends ErrorModel {
    constructor(message, status = 500) {
        super(message, status, 'Form submission failed');
    }
}

class FormServiceError extends ErrorModel {
    constructor(message, status = 500) {
        super(message, status, 'Unable to retrieve form');
    }
}

class AllocationError extends ErrorModel {
    constructor(message, status = 500) {
        super(message, status, 'Unable to allocate case');
    }
}

class ValidationError extends ErrorModel {
    constructor(message, fields) {
        super(message, 200, 'Form validation failed');
        this.fields = fields;
    }
}

class DocumentError extends ErrorModel {
    constructor(message, status = 500) {
        super(message, status, 'Request failed');
    }
}

class DocumentNotFoundError extends ErrorModel {
    constructor(message, status = 404) {
        super(message, status, 'Request failed');
    }
}

class PermissionError extends ErrorModel {
    constructor(message, status = 401) {
        super(message, status, 'Unauthorised');
    }
}

module.exports = {
    ActionError,
    AllocationError,
    AuthenticationError,
    DocumentError,
    DocumentNotFoundError,
    FormSubmissionError,
    FormServiceError,
    ValidationError,
    PermissionError
};