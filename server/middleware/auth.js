const User = require('../models/user');
const { AuthenticationError } = require('../models/error');
const logger = require('../libs/logger');
const events = require('../models/events');

function authMiddleware(req, res, next) {
    if (req.get('X-Auth-Token')) {
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
    logger.error({ event: events.AUTH_FAILURE });
    next(new AuthenticationError('You are not logged in'));
}

function protectAction() {
    return (req, res, next) => {
        if (req.form) {
            if (req.form.requiredRole) {
                if (User.hasRole(req.user, req.form.requiredRole.toUpperCase())) {
                    return next();
                }
                logger.error({ event: events.AUTH_FAILURE, expected: req.form.requiredRole.toUpperCase(), user: req.user.username, roles: req.user.roles });
                return next(new AuthenticationError('You do not have permission to access the requested page'));
            }
            return next();
        }
        logger.error({ event: events.AUTH_FAILURE, user: req.user.username, roles: req.user.roles });
        next(new AuthenticationError('Unable to authenticate'));
    };
}

function protect(permission) {
    return (req, res, next) => {
        if (User.hasRole(req.user, permission)) {
            return next();
        }
        logger.error({ event: events.AUTH_FAILURE, expected: permission, user: req.user.username, roles: req.user.roles });
        next(new AuthenticationError('You do not have permission to access the requested page'));
    };
}

module.exports = {
    authMiddleware,
    protectAction,
    protect
};