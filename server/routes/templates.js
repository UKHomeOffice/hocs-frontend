const router = require('express').Router();
const { getTemplate } = require('../middleware/templates');

router.get('/:caseId/stage/:stageId/template/:templateId', getTemplate);

module.exports = router;