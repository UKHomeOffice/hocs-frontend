const router = require('express').Router();
const { secureFileMiddleware: processRequestBody } = require('../middleware/file');
const { processMiddleware: processForm } = require('../middleware/process');
const { validationMiddleware: validateForm } = require('../middleware/validation');
const { getForm } = require('../services/form');
const form = require('../services/forms/schemas/search');
const { ValidationError } = require('../models/error');

router.all(['/search', '/api/search', '/api/form/search'], getForm(form, { submissionUrl: '/search/results' }));
router.get('/api/form/search', (req, res) => res.json(req.form));

router.post(['/search/results', '/api/search/results'],
    processRequestBody(form().getFields()),
    getForm(form, { submissionUrl: '/search/results' }),
    processForm,
    validateForm,
    (req, res, next) => Object.keys(req.form.data).length > 0 ? next() : res.json({ errors: { form: 'No search criteria specified' } }),
    (req, res, next) => {
        // Get search results
        // Transform data to match workstack
        // Attach to res.locals
        res.locals.workstack = {
            label: 'Workstack',
            items: [
                { uuid: '123456789', caseUUID: '123456789', caseReference: 'ABC/123456/19', stageTypeDisplay: 'Stage', assignedUserDisplay: 'He-Man', assignedTeamDisplay: 'Team A', deadlineDisplay: '01/01/2020' },
                { uuid: '123456789', caseUUID: '123456789', caseReference: 'ABC/123457/19', stageTypeDisplay: 'Stage', assignedUserDisplay: 'He-Man', assignedTeamDisplay: 'Team A', deadlineDisplay: '01/01/2020' },
                { uuid: '123456789', caseUUID: '123456789', caseReference: 'ABC/123458/19', stageTypeDisplay: 'Stage', assignedUserDisplay: 'He-Man', assignedTeamDisplay: 'Team A', deadlineDisplay: '01/01/2020' },
                { uuid: '123456789', caseUUID: '123456789', caseReference: 'ABC/123459/19', stageTypeDisplay: 'Stage', assignedUserDisplay: 'He-Man', assignedTeamDisplay: 'Team A', deadlineDisplay: '01/01/2020' }
            ]
        };
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