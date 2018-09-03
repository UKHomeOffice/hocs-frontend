const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { authMiddleware } = require('../middleware/auth');
const { workstackMiddleware, workstackAjaxResponseMiddleware } = require('../middleware/workstack');
const { errorAjaxResponseMiddleware, errorMiddleware } = require('../middleware/request');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const formRouter = require('./forms/index');
const actionRouter = require('./action/index');
const caseRouter = require('./case/index');
const stageRouter = require('./stage/index');

//TODO: REMOVE AND REFACTOR
const { caseworkServiceClient } = require('../libs/request');
const { s3 } = require('../libs/aws');

html.use(assets);

router.use('*', authMiddleware);

router.get(['/', '/page/workstack'], workstackMiddleware);

router.get('/page/workstack', workstackAjaxResponseMiddleware);

router.use('/action', actionRouter);

router.use('/case', caseRouter);

router.use('/case', stageRouter);

router.get('/case/:caseId/document/:documentId', (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400');
    s3.getObject({
        Bucket: 'hocs-secure-bucket',
        Key: req.params.documentId
    }).createReadStream().pipe(res);
});

router.get('/case/:caseId/document', (req, res) => {
    caseworkServiceClient.get(`/case/${req.params.caseId}/document`, { responseType: 'stream' })
        .then(response => {
            response.data.pipe(res);
        })
        .catch(error => {
            res.status(404).send(error);
        });
});

router.post(['/action/*', '/case/*'], errorAjaxResponseMiddleware);

router.use('/forms', formRouter);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;