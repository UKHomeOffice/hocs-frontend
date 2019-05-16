const { templatesService } = require('../clients');
const getLogger = require('../libs/logger');
const { DocumentError } = require('../models/error');
const User = require('../models/user');

async function getTemplate(req, res, next) {
    const logger = getLogger(req.requestId);
    const { caseId } = req.params;
    const { user } = req;
    let options = {
        headers: User.createHeaders(user),
        responseType: 'stream'
    };
    logger.info('REQUEST_TEMPLATE', { ...req.params });
    try {
        const response = await templatesService.get(`/template/${caseId}`, options );
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_TEMPLATE_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_TEMPLATE_FAILURE', { ...req.params });
        next(new DocumentError('Unable to retrieve template'));
    }
}

module.exports = {
    getTemplate
};