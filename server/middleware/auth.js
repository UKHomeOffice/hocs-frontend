const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ForbiddenError } = require('../models/error');
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
                uuid: req.get('X-Auth-Subject'),
                tenant: req.get('X-Auth-Tenant')
            });
        }
        return next();
    }
    logger.error('AUTH_FAILURE');
    return next(new ForbiddenError('Unauthorised', 401));

}

function sessionExpiryMiddleware(req, res, next) {
    const logger = getLogger(req.requestId);
    const sessionExpiry = getSessionExpiry(logger, req);
    if (sessionExpiry) {
        res.setHeader('X-Auth-Session-ExpiresAt', sessionExpiry);
    }
    return next();
}

function getSessionExpiry(logger, req) {
    const accessTokenExpiry = req.get('X-Auth-ExpiresIn');
    logger.debug(`access token expires at: ${accessTokenExpiry}`);
    try {
        const encryptedRefreshToken = req.cookies['kc-state'];
        if (encryptedRefreshToken && encryptedRefreshToken.length > 0) {
            logger.debug(`encrypted refresh token: ${encryptedRefreshToken}`);
            const tokenEncryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || '');
            if (tokenEncryptionKey.length > 0) {
                logger.debug(`token encryption key: ${tokenEncryptionKey}`);
                const decryptedToken = decrypt(encryptedRefreshToken, tokenEncryptionKey);
                logger.debug(`decrypted token: ${decryptedToken}`);
                if (decryptedToken) {
                    const decodedToken = jwt.decode(decryptedToken);
                    logger.debug(`decoded refresh token: ${decodedToken}`);
                    const expiry = decodedToken.exp;
                    logger.debug(`decoded refresh token expiry: ${expiry}`);
                    if (expiry) {
                        // Keycloak allows a 2 minute buffer so we need to add this
                        const expiryMilliseconds = 120000 + (expiry * 1000);
                        const expiresIn = (expiryMilliseconds - new Date().getTime()) / 1000;
                        logger.debug(`decoded refresh token expires in: ${expiresIn}`);
                        const expiresAt = new Date(expiryMilliseconds).toUTCString();
                        logger.debug(`decoded refresh token expires at: ${expiresAt}`);
                        return expiresAt;
                    }
                }
            }
        }
    } catch (e) {
        logger.error(`error decoding the refresh token: ${e}`);
    }
    logger.info('unable to get session expiry from refresh token. Using access token expiry');
    return accessTokenExpiry;
}

function decrypt(input, key) {
    const ivLength = 12;
    const tagLength = 16;

    const inputBuffer = Buffer.from(input, 'base64');
    const iv = Buffer.allocUnsafe(ivLength);
    const tag = Buffer.allocUnsafe(tagLength);
    const data = Buffer.alloc(inputBuffer.length - ivLength - tagLength, 0);

    inputBuffer.copy(iv, 0, 0, ivLength);
    inputBuffer.copy(tag, 0, inputBuffer.length - tagLength);
    inputBuffer.copy(data, 0, ivLength);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

    decipher.setAuthTag(tag);

    let dec = decipher.update(data, null, 'utf8');
    dec += decipher.final('utf8');
    return dec;
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
    authMiddleware,
    protect,
    sessionExpiryMiddleware
};
