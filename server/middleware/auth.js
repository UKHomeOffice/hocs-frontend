const logger = require('../libs/logger');
const User = require('../models/user');

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
    }
    if (req.originalUrl !== '/unauthorised') {
        res.redirect('/unauthorised');
    }
    next();
}

function protectAction({ redirect }) {
    return (req, res, next) => {
        if (User.hasRole(req.user, req.form.requiredRole.toUpperCase())) {
            return next();
        } else if (redirect) {
            return res.redirect('/unauthorized');
        } else {
            return res.status(403).send();
        }
    };
}

/*
    router.get('/some/test/route', protect('SOME_PERMISSION'), (req, res) => {
        res.send('ALLOWED');
    });
*/

function protect(permission, { redirect }) {
    return (req, res, next) => {
        if (User.hasRole(req.user, permission)) {
            return next();
        } else if (redirect) {
            return res.redirect('/unauthorized');
        } else {
            return res.status(403).send();
        }
    };
}

module.exports = {
    buildUserModel,
    protectAction,
    protect
};