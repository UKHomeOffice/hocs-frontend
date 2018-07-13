const router = require('express').Router();
const actionRouter = require('./action/index');
const caseRouter = require('./case/index');
const stageRouter = require('./stage/index');
const formRouter = require('./forms/index');
const renderMiddleware = require('../middleware/render.js');

router.use('/forms', formRouter);
router.use('/action', actionRouter);
router.use('/case', stageRouter);
router.use('/case', caseRouter);

router.post(['/case/*', '/action/*'], (req, res, next) => {
    if (!res.noScript) {
        return res.status(200).send({ errors: req.form.errors });
    }
    next();
});

router.post(['/case/*', '/action/*'], renderMiddleware);

router.post(['/case/*', '/action/*'], (req, res) => {
    return res.status(200).send(res.rendered);
});

module.exports = router;