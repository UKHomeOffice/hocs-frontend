const { caseworkService } = require('../clients');
const User = require('../models/user');
const getLogger = require('../libs/logger');

const getOverview = async (req, res, next) => {
    const logger = getLogger(req.request);

    try {
        logger.info('REQUEST_OVERVIEW', { ...req.params });
        const  i = req.url.indexOf('?');
        const queryString = req.url.substr(i+1);
        const response = await caseworkService.get('/overview?' + queryString, { headers: User.createHeaders(req.user) });
        res.locals.overview = response.data;
        next();
    } catch (error) {
        console.log(error);
        logger.error('REQUEST_OVERVIEW_FAILURE', { message: error.message, stack: error.stack });
        next(error);
    }
};

const overviewApiResponseMiddleware = (_, res) => {
    res.json(res.locals.overview);
};

module.exports = {
    getOverview,
    overviewApiResponseMiddleware
};
