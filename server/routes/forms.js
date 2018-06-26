const router = require('express').Router();
const actionRouter = require('./action/index');
const caseRouter = require('./case/index');
const formRouter = require('./forms/index');

router.use('/forms', formRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);

module.exports = router;