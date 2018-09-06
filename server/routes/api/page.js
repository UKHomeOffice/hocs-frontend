const router = require('express').Router();
const { apiWorkstackMiddleware } = require('../../middleware/workstack');

router.get('/workstack',
    apiWorkstackMiddleware
);

module.exports = router;