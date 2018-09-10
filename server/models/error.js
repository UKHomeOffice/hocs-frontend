const { isProduction } = require('../config');

class ErrorModel extends Error {

    constructor(message, status, title) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || 500;
        this.title = title || 'Error';
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
    constructor(message) {
        super(message, 403, 'Authentication error');
    }
}

class ActionError extends ErrorModel {
    constructor(message) {
        super(message, 500, 'Unable to perform action');
    }
}

class FormSubmissionError extends ErrorModel {
    constructor(message) {
        super(message, 500, 'Form submission failed');
    }
}

class FormServiceError extends ErrorModel {
    constructor(message) {
        super(message, 500, 'Unable to retrieve form');
    }
}

class AllocationError extends ErrorModel {
    constructor(message) {
        super(message, 500, 'Unable to allocate case');
    }
}

class ValidationError extends ErrorModel {
    constructor(message, fields) {
        super(message, 200, 'Form validation failed');
        this.fields = fields;
    }
}

class DocumentError extends ErrorModel {
    constructor(message) {
        super(message, 500, 'Request failed');
    }
}

class DocumentNotFoundError extends ErrorModel {
    constructor(message) {
        super(message, 404, 'Request failed');
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
    ValidationError
};