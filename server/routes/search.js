const router = require('express').Router();
const { secureFileMiddleware: processRequestBody } = require('../middleware/file');
const { processMiddleware: processForm } = require('../middleware/process');
const { validationMiddleware: validateForm } = require('../middleware/validation');
const { getForm, hydrateFields } = require('../services/form');
const form = require('../services/forms/schemas/search');
const { ValidationError } = require('../models/error');
// TODO: Remove temp stub
const getList = async () => { };

router.all(['/search', '/api/search', '/api/form/search'], getForm(form, { submissionUrl: '/search/results' }), hydrateFields);
router.get('/api/form/search', (req, res) => res.json(req.form));

router.post(['/search/results', '/api/search/results'],
    processRequestBody(form().getFields()),
    getForm(form, { submissionUrl: '/search/results' }),
    hydrateFields,
    processForm,
    validateForm,
    (req, res, next) => Object.keys(req.form.data).length > 0 ? next() : res.json({ errors: { form: 'No search criteria specified' } }),
    async (req, res, next) => {
        try {
            // TODO: Call client direct
            const results = await getList('SEARCH', { user: req.user, form: req.form.data });
            res.locals.workstack = results;
            next();
        } catch (e) {
            next(e);
        }
    },
    (req, res, next) => {
        res.locals.workstack.breadcrumbs = [
            { to: '/', label: 'Dashboard' },
            { to: '/search', label: 'Search' },
            { to: '/search/results', label: 'Results' }
        ];
        next();
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