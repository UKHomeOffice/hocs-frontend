const User = require('../models/user');
const { ForbiddenError } = require('../models/error');
const getLogger = require('../libs/logger');
const passport = require('passport');
const { KeycloakClient } = require('../libs/auth');
const { forContext } = require('../config');

const loginMiddleware = passport.authenticate('keycloak');

const loginCallbackMiddleware = passport.authenticate('keycloak', {
    //TODO: is there a better way to handle this redirect?
    successRedirect: 'back',
    failureRedirect: '/login' // Redirect to the login page
});

const logoutMiddleware = (req, res, next) => {
    console.log("logoutMiddleware")
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy();
        //const { ISSUER, LOGIN_URI } = forContext('AUTH').ISSUER;

        const ISSUER = 'http://localhost:9081/auth/realms/hocs';
        const LOGIN_URI = 'http://localhost:8080/login'

        const keycloakLogoutUrl = `${ISSUER}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(LOGIN_URI)}`;
        res.redirect(keycloakLogoutUrl);
    });
};

function sessionExpiryMiddleware(req, res, next) {
    const logger = getLogger(req.requestId);
    const sessionExpiry = getSessionExpiry(logger, req);
    if (sessionExpiry) {
        res.setHeader('X-Auth-Session-ExpiresAt', sessionExpiry);
    }
    return next();
}

async function handleTokenRefresh(req, res, next) {
    console.log("handleTokenRefresh")
    const {
        accessTokenExpiry,
        refreshTokenExpiry,
        refreshToken
    } = req.user.tokenSet;

    if (accessTokenExpiry && accessTokenExpiry > (Date.now() / 1000)) {
        return next();
    }

    if (refreshTokenExpiry && refreshTokenExpiry > (Date.now() / 1000)) {
        const client = await KeycloakClient().getClient();
        let refreshedTokenSet;
        try {
            refreshedTokenSet = await client.refresh(refreshToken);
        } catch (err) {
            // Some instances were identified within buffer period where token was marked invalid.
            // TODO: if we handle the cookie expiry better, we can remove this
            req.session.destroy();
            return res.redirect('/login');
        }

        req.user.tokenSet = {
            accessTokenExpiry: refreshedTokenSet.expires_at,
            refreshTokenExpiry: Math.floor((Date.now() / 1000) + refreshedTokenSet.refresh_expires_in + 120),
            refreshToken: refreshedTokenSet.refresh_token
        };
        req.session.passport.user = req.user;
        req.session.save();
        return next();
    }

    req.session.destroy();
    return res.redirect('/login');
}

function getSessionExpiry(logger, req) {
    const {
        accessTokenExpiry,
        refreshTokenExpiry,
    } = req.user.tokenSet;

    logger.debug(`Access token expires at: ${accessTokenExpiry}`);
    logger.debug(`Refresh token expiry: ${refreshTokenExpiry}`);

    if (refreshTokenExpiry) {
        const expiresAt = new Date(refreshTokenExpiry * 1000);
        logger.debug(`Refresh token expires at: ${expiresAt}`);
        return expiresAt.toUTCString();
    }

    logger.info('Unable to get session expiry from refresh token. Using access token expiry');
    return new Date(accessTokenExpiry * 1000);
}

function protect(permission) {
    return (req, res, next) => {
        const logger = getLogger(req.requestId);
        if (User.hasRole(req.user, permission)) {
            return next();
        }
        logger.error('AUTH_FAILURE', { expected: permission, user: req.user.username, roles: req.user.roles });
        return next(new ForbiddenError('Unauthorised'));
    };
}

module.exports = {
    loginMiddleware,
    loginCallbackMiddleware,
    logoutMiddleware,
    protect,
    sessionExpiryMiddleware,
    handleTokenRefresh
};
