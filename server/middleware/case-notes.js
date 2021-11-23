const getLogger = require('../libs/logger');

async function getCaseNotes(req, res, next) {
    const logger = getLogger(req.requestId);
    try {
        const results = await req.listService.fetch('CASE_NOTES', req.params);
        res.locals.caseNotes = results;
    } catch (error) {
        logger.error('ERROR', { message: error.message, stack: error.stack });
        return next('Failed to fetch timeline');
    }
    next();
}

async function getCaseNotesApiResponse(req, res) {
    res.json(res.locals.caseNotes);
}

module.exports = {
    getCaseNotes,
    getCaseNotesApiResponse
};