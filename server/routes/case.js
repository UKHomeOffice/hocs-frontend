const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const renderMiddleware = require('../middleware/render');
const authMiddleware = require('../middleware/auth');

html.use(assets);

router.use('*', authMiddleware);

router.use('*', (req, res, next) => {
    // const id = req.params.id;
    // req.session.stage = caseModel.getStage(id);
    //
    next();
});

router.use('*', renderMiddleware);

router.get('*', (req, res) => {
    res.send(res.rendered);
});

module.exports = router;