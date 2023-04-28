const router = require('express').Router();
const { secureFileMiddleware: processRequestBody } = require('../middleware/file');
const { processMiddleware: processForm } = require('../middleware/form/process');
const { handleSearch } = require('../middleware/searchHandler');
const { getForm, hydrateFields } = require('../services/form');
const form = require('../services/forms/schemas/search');
const { ValidationError } = require('../models/error');

router.all(['/search', '/api/search', '/api/form/search'], getForm(form, { submissionUrl: '/search/results' }), hydrateFields);
router.get('/api/form/search', (req, res) => res.json(req.form));

router.post(['/search/results', '/api/search/results'],
    async (req, res, next) => {
        const formBuilder = await form({ submissionUrl: '/search/results', user: req.user,
            requestId: req.requestId, listService: req.listService });
        processRequestBody(formBuilder.getFields())(req, res, next);
    },
    getForm(form, { submissionUrl: '/search/results' }),
    hydrateFields,
    processForm,
    (req, res, next) => Object.keys(req.form.data).length > 0 ? next() : res.json({ errors: { form: 'No search criteria specified' } }),
    handleSearch,
    (req, res, next) => {
        res.locals.workstack.breadcrumbs = [
            { to: '/', label: 'Dashboard' },
            { to: '/search', label: 'Search' },
            { to: '/search/results', label: 'Results' }
        ];
        return next();
    }
);

router.post('/api/search/results', (req, res) => {
    res.json({ forwardProps: { workstack: res.locals.workstack }, redirect: '/search/results' });
});

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
