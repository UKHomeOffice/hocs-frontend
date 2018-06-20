const logger = require('../libs/logger');

const authentication = (req, res, next) => {
    logger.info('AUTH MIDDLEWARE');
    next();
};

module.exports = authentication;