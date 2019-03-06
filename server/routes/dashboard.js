const router = require('express').Router();
const { secureFileMiddleware: processRequestBody } = require('../middleware/file');
const { processMiddleware: processForm } = require('../middleware/process');
const { validationMiddleware: validateForm } = require('../middleware/validation');
const { dashboardMiddleware: getDashboardData } = require('../middleware/dashboard');
const { getForm } = require('../services/form');
const form = require('../services/forms/schemas/dashboard-search');
const { ValidationError } = require('../models/error');
const { caseworkServiceClient } = require('../libs/request');
const User = require('../models/user');

router.all(['/', '/api/form'],
    getForm(form, { submissionUrl: '/search/reference' }),
    getDashboardData
);

router.post(['/search/reference', '/api/search/reference'],
    processRequestBody(form().getFields()),
    getForm(form, { submissionUrl: '/search/results' }),
    processForm,
    validateForm
);

router.post('/search/reference', async (req, res, next) => {
    const reference = encodeURI(req.form.data['case-reference']);
    try {
        const response = await caseworkServiceClient.get(`/search/${reference}`, {
            headers: User.createHeaders(req.user)
        });
        const { caseUUID, stageUUID } = response.data;
        res.redirect(`/case/${caseUUID}/stage/${stageUUID}`);
    } catch (error) {
        next('Failed to find case');
    }
});

router.post('/api/search/reference', async (req, res) => {
    const reference = encodeURI(req.form.data['case-reference']);
    try {
        const response = await caseworkServiceClient.get(`/search/${reference}`, {
            headers: User.createHeaders(req.user)
        });
        const { caseUUID, stageUUID } = response.data;
        res.json({ redirectUrl: `/case/${caseUUID}/stage/${stageUUID}` });
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