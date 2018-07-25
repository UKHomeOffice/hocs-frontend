const logger = require('../libs/logger');
const User = require('../models/user');
const ErrorModel = require('../models/error');

function buildUserModel(req, res, next) {
    logger.debug('AUTH MIDDLEWARE');
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
    } else {
        req.error = new ErrorModel({
            status: 403,
            title: 'Unauthorised',
            summary: 'You are not logged in'
        }).toJson();
    }
    next();
}

function protectAction() {
    return (req, res, next) => {
        if (req.form) {
            if (User.hasRole(req.user, req.form.requiredRole.toUpperCase())) {
                return next();
            } else {
                req.error = new ErrorModel({
                    status: 403,
                    title: 'Unauthorised',
                    summary: 'You do not have permission to access the requested page',
                    stackTrace: `Required role: ${req.form.requiredRole.toUpperCase()}`
                }).toJson();
            }
        }
        next();
    };
}

/*
    router.get('/some/test/route', protect('SOME_PERMISSION'), (req, res) => {
        res.send('ALLOWED');
    });
*/

function protect(permission) {
    return (req, res, next) => {
        if (User.hasRole(req.user, permission)) {
            return next();
        } else {
            req.error = new ErrorModel({
                status: 403,
                title: 'Unauthorised',
                summary: 'You do not have permission to access the requested page',
                stackTrace: `Required role: ${permission}`
            }).toJson();
        }
        next();
    };
}

module.exports = {
    buildUserModel,
    protectAction,
    protect
};