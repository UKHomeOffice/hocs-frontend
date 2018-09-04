const router = require('express').Router();
const apiFormRouter = require('./form');
const apiDocumentRouter = require('./document');
const apiActionRouter = require('./action');
const apiCaseRouter = require('./case');
const apiPageRouter = require('./page');

router.use('/form', apiFormRouter);
router.use('/case', apiDocumentRouter);
router.use('/action', apiActionRouter);
router.use('/case', apiCaseRouter);
router.use('/page', apiPageRouter);

module.exports = router;