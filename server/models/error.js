const { isProduction } = require('../config');

class ErrorModel {
    constructor({ title, summary, status, stackTrace }) {
        this.errorCode = status;
        this.title = title;
        this.error = summary;
        if (!isProduction) {
            this.stack = stackTrace;
        }
    }
}

module.exports = ErrorModel;