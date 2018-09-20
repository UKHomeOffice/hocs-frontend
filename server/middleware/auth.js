const User = require('../models/user');
const { AuthenticationError } = require('../models/error');

function authMiddleware(req, res, next) {
    if (req.get('X-Auth-Token')) {
        if (!req.user) {
            req.user = new User({
                username: req.get('X-Auth-Username'),
                id: req.get('X-Auth-UserId'),
                groups: req.get('X-Auth-Groups'),
                roles: req.get('X-Auth-Roles'),
                email: req.get('X-Auth-Email')
            });
        }
        return next();
    }
    next(new AuthenticationError('You are not logged in'));
}

function protectAction() {
    return (req, res, next) => {
        if (req.form) {
            if (User.hasRole(req.user, req.form.requiredRole.toUpperCase())) {
                return next();
            }
        }
        next(new AuthenticationError('You do not have permission to access the requested page'));
    };
}

function protect(permission) {
    return (req, res, next) => {
        if (User.hasRole(req.user, permission)) {
            return next();
        }
        next(new AuthenticationError('You do not have permission to access the requested page'));
    };
}

module.exports = {
    authMiddleware,
    protectAction,
    protect
};