const router = require('express').Router();
const { loginMiddleware, loginCallbackMiddleware, logoutMiddleware, handleTokenRefresh, sessionExpiryMiddleware} = require('../middleware/auth');

router.get('/login', loginMiddleware);

router.get('/auth/callback', loginCallbackMiddleware);

router.get('/logout', logoutMiddleware);

router.get('/auth/refresh', handleTokenRefresh, sessionExpiryMiddleware);

module.exports = router;
