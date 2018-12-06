const router = require('express').Router();
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { authMiddleware } = require('../middleware/auth');
const apiRouter = require('./api/index');
const pageRouter = require('./page');
const actionRouter = require('./action');
const caseRouter = require('./case');
const documentRouter = require('./document');
const healthRouter = require('./health');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const { errorMiddleware, initRequest } = require('../middleware/request');
const { protect } = require('../middleware/auth');
const { infoServiceClient, workflowServiceClient } = require('../libs/request');
const logger = require('../libs/logger');

const { fileMiddleware } = require('../middleware/file');

html.use(assets);

router.use('/health', healthRouter);
router.use('*', authMiddleware, initRequest);
router.use('/', pageRouter);
router.use('/api', apiRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/case', documentRouter);

const allocateUser = async ([endpoint, body, headers]) => {
    await workflowServiceClient.post(endpoint, body, headers)
};

router.post('/workstack/allocate/team',
    fileMiddleware.any(),
    async (req, res, next) => {
        const user = req.user;
        const { selected_cases = [], selected_user } = req.body;
        if (selected_cases.length > 0 && selected_user) {
            selected_cases
                .map(selected => selected.split(':'))
                .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/userUUID`, { userUUID: selected_user }, {
                    headers: {
                        'X-Auth-UserId': user.id,
                        'X-Auth-Roles': user.roles.join(),
                        'X-Auth-Groups': user.groups.join()
                    }
                }])
                .forEach(allocateUser);
        }
        res.send('OK')
    }
);

router.post('/workstack/allocate/user',
    fileMiddleware.any(),
    async (req, res, next) => {
        const user = req.user;
        const { selected_cases = [] } = req.body;
        if (selected_cases.length > 0) {
            selected_cases
                .map(selected => selected.split(':'))
                .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/userUUID`, { userUUID: user.id }, {
                    headers: {
                        'X-Auth-UserId': user.id,
                        'X-Auth-Roles': user.roles.join(),
                        'X-Auth-Groups': user.groups.join()
                    }
                }])
                .forEach(allocateUser);
        }
        res.send('OK')
    }
);

router.post('/workstack/unallocate',
    fileMiddleware.any(),
    async (req, res, next) => {
        const user = req.user;
        const { selected_cases = [] } = req.body;
        if (selected_cases.length > 0) {
            selected_cases
                .map(selected => selected.split(':'))
                .map(([caseId, stageId]) => [`/case/${caseId}/stage/${stageId}/userUUID`, { userUUID: null }, {
                    headers: {
                        'X-Auth-UserId': user.id,
                        'X-Auth-Roles': user.roles.join(),
                        'X-Auth-Groups': user.groups.join()
                    }
                }])
                .forEach(allocateUser);
        }
        res.send('OK')
    }
);

router.get('/members/refresh',
    protect('REFRESH_MEMBERS'),
    async (req, res, next) => {
        try {
            await infoServiceClient.get('/members/refresh');
            logger.info('request to update members in info service');
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    });


router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;