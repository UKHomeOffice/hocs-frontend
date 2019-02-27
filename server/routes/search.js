const router = require('express').Router();
const { secureFileMiddleware: processRequestBody } = require('../middleware/file');
const { processMiddleware: processForm } = require('../middleware/process');
const { validationMiddleware: validateForm } = require('../middleware/validation');
const { getForm } = require('../services/form');
const form = require('../services/forms/schemas/search');

// TODO: Move to form builder
const createFormFieldsList = fields => fields.reduce((reducer, field) => {
    if (field.component === 'date') {
        reducer.push(`${field.props.name}-day`, `${field.props.name}-month`, `${field.props.name}-year`);
        return reducer;
    }
    reducer.push({ name: field.props.name });
    return reducer;
}, []);

router.all(['/search', '/api/search'], getForm(form));
router.get('/api/form/search', (req, res) => res.send(req.form));

// router.get('/search', )

router.post(['/search', '/api/search'],
    // TODO: Refactor createFormFieldList to be a method on formBuilder
    processRequestBody(createFormFieldsList(form().schema.fields)),
    processForm,
    validateForm,
    (req, res) => res.json({ redirect: '/' })
);

module.exports = router;