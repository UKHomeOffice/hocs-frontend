const router = require('express').Router();
const { loginMiddleware, loginCallbackMiddleware, logoutMiddleware } = require('../middleware/auth');

router.get('/login', loginMiddleware);

router.get('/auth/callback', loginCallbackMiddleware);

router.get('/logout', logoutMiddleware);

module.exports = router;
