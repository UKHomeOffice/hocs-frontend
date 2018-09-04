const { caseworkServiceClient } = require('../libs/request');
const logger = require('../libs/logger');

const workstackMiddleware = async (req, res, next) => {
    try {
        const response = await caseworkServiceClient.get('/stage/active');
        res.locals.workstack = response.data.activeStages;
        next();
    } catch (e) {
        logger.error(e.stack);
        res.locals.workstack = [];
        next();
    }
};
const workstackAjaxResponseMiddleware = async (req, res) => {
    res.send(req.locals.workstack);
};

module.exports = {
    workstackMiddleware,
    workstackAjaxResponseMiddleware
};