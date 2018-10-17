const router = require('express').Router();
const { liveness, readiness } = require('../middleware/health');

router.get('/', liveness);
router.get('/status', readiness);

module.exports = router;