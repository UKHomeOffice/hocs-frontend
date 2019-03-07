const { getList } = require('../services/list');

async function dashboardMiddleware(req, res, next) {
    try {
        const response = await getList('DASHBOARD', { ...req.params, user: req.user });
        req.form.meta.dashboard = response;
        next();
    } catch (e) {
        next(e);
    }
}

module.exports = {
    dashboardMiddleware
};