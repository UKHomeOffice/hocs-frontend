const { getList } = require('../services/list');

async function dashboardMiddleware(req, res, next) {
    try {
        const response = await getList('DASHBOARD', { ...req.params, user: req.user });
        res.locals.dashboard = response;
        next();
    } catch (e) {
        next(e);
    }
}


function dashboardApiResponseMiddleware(req, res) {
    res.json(res.locals.dashboard);
}

module.exports = {
    dashboardMiddleware,
    dashboardApiResponseMiddleware
};