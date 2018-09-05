const { caseworkServiceClient } = require('../libs/request');
const logger = require('../libs/logger');

async function workstackMiddleware(req, res, next) {
    try {
        const response = await caseworkServiceClient.get('/stage/active');
        res.locals.workstack = response.data.activeStages;
        next();
    } catch (e) {
        logger.error(e.stack);
        res.locals.workstack = [];
        next();
    }
}

async function workstackApiResponseMiddleware(req, res) {
    res.json(res.locals.workstack);
}

module.exports = {
    workstackMiddleware,
    workstackApiResponseMiddleware
};