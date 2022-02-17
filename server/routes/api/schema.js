const router = require('express').Router();
const { getFieldsForSchema } = require('../../services/schema');
const { hydrateFields } = require('../../services/form');


router.get(['/:schemaType/fields'],
    getFieldsForSchema,
    hydrateFields,
    (req, res) => {
        res.status(200).send(res.form);
    }
);

module.exports = router;
