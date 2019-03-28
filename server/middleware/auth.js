const User = require('../models/user');
const { AuthenticationError } = require('../models/error');
const getLogger = require('../libs/logger');

function authMiddleware(req, res, next) {
    const logger = getLogger(req.requestId);
    if (req.get('X-Auth-Token')) {
        if (!req.user) {
            req.user = new User({
                username: req.get('X-Auth-Username'),
                id: req.get('X-Auth-UserId'),
                groups: req.get('X-Auth-Groups'),
                roles: req.get('X-Auth-Roles'),
                email: req.get('X-Auth-Email'),
                uuid: req.get('X-Auth-Subject')
            });
        }
        return next();
    }
    logger.error('AUTH_FAILURE');
    next(new AuthenticationError('Unauthorised', 401));
}

function protect(permission) {
    return (req, res, next) => {
        const logger = getLogger(req.requestId);
        if (User.hasRole(req.user, permission)) {
            return next();
        }
        logger.error('AUTH_FAILURE', { expected: permission, user: req.user.username, roles: req.user.roles });
        next(new AuthenticationError('Unauthorised'));
    };
}

module.exports = {
    authMiddleware,
    protect
};