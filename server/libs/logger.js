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

const logstashFormat = (statement) => {
    const logstashStatement = Object.assign({}, statement);
    if(typeof logstashStatement.message === 'object') {
        const messageObj = logstashStatement.message;
        delete logstashStatement.message;
        Object.assign(logstashStatement, messageObj);
    }

    if (logstashStatement.timestamp !== undefined) {
        logstashStatement['@timestamp'] = logstashStatement.timestamp;
        delete logstashStatement.timestamp;
    }
    logstashStatement.appName = 'hocs-frontend';
    return JSON.stringify(logstashStatement);
};

const format = isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(logstashFormat)
    )
    : winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(statement => `${statement.timestamp} ${`[${statement.level.toLocaleUpperCase()}]`.padStart(7)} ${JSON.stringify(statement.message)}`),
        winston.format.colorize({ colors }),
    );

loggingTransports.push(new (winston.transports.Console)({ format }));

exceptionTransports.push(new (winston.transports.Console)({ format }));

const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    transports: loggingTransports,
    exceptionHandlers: exceptionTransports,
    exitOnError: true
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
