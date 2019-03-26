const router = require('express').Router();
const { secureFileMiddleware: processRequestBody } = require('../middleware/file');
const { processMiddleware: processForm } = require('../middleware/process');
const { validationMiddleware: validateForm } = require('../middleware/validation');
const { dashboardMiddleware: getDashboardData } = require('../middleware/dashboard');
const { getForm } = require('../services/form');
const form = require('../services/forms/schemas/dashboard-search');
const { ValidationError } = require('../models/error');
// TODO: Remove temp stub
const getList = async () => { };

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
        try {
            // TODO: Call client direct
            const results = await getList('SEARCH_REFERENCE', { user: req.user, form: req.form.data });
            res.locals.workstack = results;
            next();
        } catch (e) {
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

/* eslint-disable-next-line no-unused-vars */
router.use('/api*', (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.status).json({ errors: err.fields });
    } else {
        return res.status(err.status || 500).json({
            message: err.message,
            status: err.status || 500,
            title: err.title
        });
    }
});

module.exports = router;