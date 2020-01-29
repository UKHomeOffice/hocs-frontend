const router = require('express').Router();

router.get('', (_, res) => res.sendStatus(200));

module.exports = router;