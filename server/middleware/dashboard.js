async function dashboardMiddleware(req, res, next) {
    try {
        const response = await req.listService.fetch('DASHBOARD', req.params);
        req.form.meta.dashboard = response;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    dashboardMiddleware
};