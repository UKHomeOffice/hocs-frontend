const router = require('express').Router();
const apiFormRouter = require('./form');
const apiDocumentRouter = require('./document');
const apiActionRouter = require('./action');
const apiCaseRouter = require('./case');
const apiWorkstackRouter = require('./workstack');
const { apiErrorMiddleware } = require('../../middleware/request');

router.use('/form', apiFormRouter);
router.use('/case', apiDocumentRouter);
router.use('/action', apiActionRouter);
router.use('/case', apiCaseRouter);
router.use('/workstack', apiWorkstackRouter);

router.use('*', apiErrorMiddleware);

module.exports = router;