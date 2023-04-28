async function dashboardMiddleware(req, res, next) {
    try {
        const response = await req.listService.fetch('DASHBOARD', req.params);
        req.form.meta.dashboard = response;
        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    dashboardMiddleware
};
