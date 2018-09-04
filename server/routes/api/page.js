const router = require('express').Router();
const { workstackMiddleware, workstackAjaxResponseMiddleware } = require('../../middleware/workstack');

router.get('/workstack',
    workstackMiddleware,
    workstackAjaxResponseMiddleware
);

module.exports = router;