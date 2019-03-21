const User = require('../models/user');

async function dashboardMiddleware(req, res, next) {
    try {
        const response = await req.fetchList('DASHBOARD', User.createHeaders(req.user), { ...req.params, user: req.user, requestId: req.requestId });
        req.form.meta.dashboard = response;
        next();
    } catch (e) {
        next(e);
    }
}

module.exports = {
    dashboardMiddleware
};