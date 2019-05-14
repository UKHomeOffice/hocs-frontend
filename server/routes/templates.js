const router = require('express').Router();
const { getTemplate } = require('../middleware/templates');

router.get('/:caseId/stage/:stageId/template', getTemplate);

module.exports = router;