const router = require('express').Router();
const { workstackMiddleware, workstackApiResponseMiddleware } = require('../../middleware/workstack');

router.get('/workstack',
    workstackMiddleware,
    workstackApiResponseMiddleware
);

module.exports = router;