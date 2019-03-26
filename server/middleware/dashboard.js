async function dashboardMiddleware(req, res, next) {
    try {
        const response = await req.fetchList('DASHBOARD', req.params);
        req.form.meta.dashboard = response;
        next();
    } catch (e) {
        next(e);
    }
}

module.exports = {
    dashboardMiddleware
};