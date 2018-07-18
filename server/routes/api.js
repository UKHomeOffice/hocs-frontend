const router = require('express').Router();
const actionRouter = require('./action/index');
const caseRouter = require('./case/index');
const stageRouter = require('./stage/index');
const formRouter = require('./forms/index');

router.use('/forms', formRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/stage', stageRouter);

router.post(['/case/*', '/action/*', '/stage/*'], (req, res, next) => {
    if (!res.noScript) {
        return res.status(200).send({ errors: req.form.errors });
    }
    next();
});

module.exports = router;