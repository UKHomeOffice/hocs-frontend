const router = require('express').Router();
const actionRouter = require('./action/index');
const caseRouter = require('./case/index');
const stageRouter = require('./stage/index');
const formRouter = require('./forms/index');

router.use('/forms', formRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/stage', stageRouter);

module.exports = router;