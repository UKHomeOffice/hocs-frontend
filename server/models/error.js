const { isProduction } = require('../config');

class ErrorModel {
    constructor({ title, summary, status, stackTrace }) {
        this.status = status;
        this.title = title;
        this.summary = summary;
        if (!isProduction) {
            this.stackTrace = stackTrace;
        }
    }

    toJson() {
        return ({
            errorCode: this.status,
            title: this.title,
            error: this.summary,
            stack: this.stackTrace
        });
    }
}

module.exports = ErrorModel;