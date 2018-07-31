const { caseworkServiceClient } = require('../libs/request');
const logger = require('../libs/logger');

const workstackMiddleware = async (req, res, next) => {
    try {
        res.data = {};
        const response = await caseworkServiceClient.get('/case/active');
        res.data.workstack = response.data;
        next();
    } catch (e) {
        logger.error(e.stack);
    }
};
const workstackAjaxResponseMiddleware = async (req, res) => {
    res.send(res.data.workstack);
};

module.exports = {
    workstackMiddleware,
    workstackAjaxResponseMiddleware
};