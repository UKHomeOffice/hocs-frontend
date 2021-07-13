const router = require('express').Router();
const apiFormRouter = require('./form');
const apiDocumentRouter = require('./document');
const apiActionRouter = require('./action');
const apiCaseRouter = require('./case');
const apiWorkstackRouter = require('./workstack');
const apiKeepaliveRouter = require('./keepalive');
const apiStandardLines = require('./standardLines');
const apiOverview = require('./overview');
const { apiErrorMiddleware } = require('../../middleware/request');

router.use('/form', apiFormRouter);
router.use('/case', apiDocumentRouter);
router.use('/action', apiActionRouter);
router.use('/case', apiCaseRouter);
router.use('/workstack', apiWorkstackRouter);
router.use('/keepalive', apiKeepaliveRouter);
router.use('/standard-lines', apiStandardLines);
router.use('/overview', apiOverview);

router.use('*', apiErrorMiddleware);

module.exports = router;
