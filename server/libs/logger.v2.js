const winston = require('winston');
const loggingTransports = [];
const exceptionTransports = [];
const { isProduction } = require('../config');

const colors = {
    info: 'green',
    email: 'magenta',
    warn: 'yellow',
    error: 'red'
};

const logstashFormat = statement => {
    const logstashStatement = Object.assign({}, statement);

    if (logstashStatement.timestamp !== undefined) {
        logstashStatement['@timestamp'] = logstashStatement.timestamp;
        delete logstashStatement.timestamp;
    }
    logstashStatement.appName = 'hocs-frontend';
    return JSON.stringify(logstashStatement);
};

loggingTransports.push(
    new (winston.transports.Console)({
        json: isProduction,
        timestamp: true,
        colorize: true,
        stringify: logstashFormat
    })
);

exceptionTransports.push(
    new (winston.transports.Console)({
        json: isProduction,
        logstash: isProduction,
        timestamp: true,
        colorize: true,
        stringify: function stringify(obj) {
            return JSON.stringify(obj);
        }
    })
);

const logger = new (winston.Logger)({
    level: isProduction ? 'info' : 'debug',
    transports: loggingTransports,
    exceptionHandlers: exceptionTransports,
    exitOnError: true,
    colors: colors
});

logger.info(`Logger mode: ${isProduction ? 'production' : 'development'}`);

module.exports = (requestId) => {
    const correlationId = requestId ? { 'X-Correlation-Id': requestId } : null;
    return {
        info: (event, options) => logger.info(Object.assign({ event_id: event }, options, correlationId)),
        warn: (event, options) => logger.warn(Object.assign({ event_id: event }, options, correlationId)),
        debug: (event, options) => logger.debug(Object.assign({ event_id: event }, options, correlationId)),
        error: (event, options) => logger.error(Object.assign({ event_id: event }, options, correlationId)),
    };
};