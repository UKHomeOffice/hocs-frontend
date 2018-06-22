const logger = require('../libs/logger');
const User = require('../models/user');

const authentication = (req, res, next) => {
    logger.info('AUTH MIDDLEWARE');
    if(req.get('X-Auth-Token')) {
        if (!req.user) {
            req.user = new User({
                token: req.get('X-Auth-Token'),
                username: req.get('X-Auth-Username'),
                id: req.get('X-Auth-UserId'),
                groups: req.get('X-Auth-Groups'),
                roles: req.get('X-Auth-Roles'),
                email: req.get('X-Auth-Email')
            });
        }
        return next();
    }
    if (req.originalUrl !== '/unauthorised') {
        res.redirect('/unauthorised');
    }
    next();
};

module.exports = authentication;