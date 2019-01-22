function createAnalyticsObject(req, res, next) {
    const tracker = process.env.GA_TRACKER || null;
    if (tracker) {
        res.locals.analytics = {
            userId: req.user.uuid,
            tracker
        };
    }
    next();
}

module.exports = {
    createAnalyticsObject
};