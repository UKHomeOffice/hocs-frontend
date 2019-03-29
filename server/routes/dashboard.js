const router = require('express').Router();
const { secureFileMiddleware: processRequestBody } = require('../middleware/file');
const { processMiddleware: processForm } = require('../middleware/process');
const { validationMiddleware: validateForm } = require('../middleware/validation');
const { dashboardMiddleware: getDashboardData } = require('../middleware/dashboard');
const { getForm } = require('../services/form');
const form = require('../services/forms/schemas/dashboard-search');
const { apiErrorMiddleware } = require('../middleware/request');
const { bindDisplayElements } = require('../lists/adapters/workstacks');
const getLogger = require('../libs/logger');
const { caseworkService } = require('../clients');
const User = require('../models/user');

router.all(['/', '/api/form'],
    getForm(form, { submissionUrl: '/search/reference' }),
    getDashboardData
);

router.post(['/search/reference', '/api/search/reference'],
    processRequestBody(form().getFields()),
    getForm(form, { submissionUrl: '/search/results' }),
    processForm,
    validateForm,
    async (req, res, next) => {
        const logger = getLogger(req.requestId);
        try {
            const formData = req.form.data;
            const reference = encodeURIComponent(formData['case-reference']);

            const response = await caseworkService.get(`/case/${reference}/stage`, {
                headers: User.createHeaders(req.user)
            });

            const fromStaticList = req.listService.getFromStaticList;
            logger.info('SEARCH_REFERENCE', { reference: formData['case-reference'] });
            const workstackData = await Promise.all(response.data.stages
                .sort((first, second) => first.caseReference > second.caseReference)
                .map(bindDisplayElements(fromStaticList)));

            res.locals.workstack = {
                label: 'Case workflows',
                items: workstackData
            };

            next();
        } catch (error) {
            logger.error('SEARCH_REFERENCE_FAILED', { message: error.message, stack: error.stack });
            return res.json({ errors: { 'case-reference': 'Failed to perform search' } });
        }
    }
);

router.post('/search/reference', async (req, res, next) => {
    if (res.locals.workstack.items.length === 1) {
        const { uuid, caseUUID } = res.locals.workstack.items[0];
        return res.redirect(`/case/${caseUUID}/stage/${uuid}`);
    }
    next();
});

router.post('/api/search/reference', async (req, res) => {
    try {
        if (res.locals.workstack.items.length > 0) {
            if (res.locals.workstack.items.length === 1) {
                const { uuid, caseUUID } = res.locals.workstack.items[0];
                return res.json({ redirect: `/case/${caseUUID}/stage/${uuid}` });
            } else {
                return res.json({ forwardProps: { workstack: res.locals.workstack }, redirect: '/search/reference' });
            }
        }
        res.json({ errors: { 'case-reference': 'No active workflows for case' } });
    } catch (error) {
        res.json({ errors: { 'case-reference': 'Failed to find case' } });
    }
});

router.get('/api/form', (req, res) => res.json(req.form));

router.use('/api*', apiErrorMiddleware);

module.exports = router;