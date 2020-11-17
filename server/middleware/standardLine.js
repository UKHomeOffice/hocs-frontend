const { infoService, documentService } = require('../clients');
const { DocumentError } = require('../models/error');
const User = require('../models/user');
const getLogger = require('../libs/logger');


const getUsersStandardLines = async (req, res, next) => {
    const logger = getLogger(req.requestId);
    const userUUID = req.user.uuid;

    try {
        logger.info('REQUEST_USER_STANDARD_LINES', { ...req.params });

        const topicList = await req.listService.fetch('TOPICS', req.params);
        const policyTeamForTopicList = await req.listService.fetch('DCU_POLICY_TEAM_FOR_TOPIC', req.params);

        const response = await infoService.get(`/user/${userUUID}/standardLine`, {}, { headers: User.createHeaders(req.user) });
        res.locals.standardLines = response.data.map(({ uuid, displayName, topicUUID, expires, documentUUID }) => {
            const expiry = formatDate(expires);
            return ({
                uuid: uuid, documentUUID: documentUUID, displayName: displayName, topic: getLabelForValue(topicList, topicUUID),
                expiryDate: expiry, isExpired: deriveIsExpired(expiry), team: getLabelForValue(policyTeamForTopicList, topicUUID)
            });
        });
        next();
    } catch (error) {
        logger.error('REQUEST_USER_STANDARD_LINES_FAILURE', { message: error.message, stack: error.stack });
        next(error);
    }
}

const getOriginalDocument = async (req, res, next) => {
    const logger = getLogger(req.requestId);
    const { documentId } = req.params;
    let options = {
        headers: User.createHeaders(req.user),
        responseType: 'stream'
    };
    logger.info('REQUEST_DOCUMENT_ORIGINAL', { ...req.params });
    try {
        const response = await documentService.get(`/document/${documentId}/file`, options);
        res.setHeader('Cache-Control', 'max-age=86400');
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
        response.data.on('finish', () => logger.debug('REQUEST_DOCUMENT_ORIGINAL_SUCCESS', { ...req.params }));
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_DOCUMENT_ORIGINAL_FAILURE', { ...req.params });
        return next(new DocumentError('Unable to retrieve original document'));
    }
};

const standardLinesApiResponseMiddleware = (_, res) => {
    res.json(res.locals.standardLines);
};

const getLabelForValue = (list, value) => {
    if (list && value) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].value === value) {
                return list[i].label;
            }
        }
    }

    return value;
};

const deriveIsExpired = (expiry) => {
    if (expiry) {
        const splitDate = expiry.split('/');
        const expiryDate = new Date(parseInt(splitDate[2], 10), parseInt(splitDate[1], 10) - 1, parseInt(splitDate[0], 10));

        return new Date(expiryDate) <= new Date();
    }

    return false;
};

const parseDate = (rawDate) => {
    const [date] = rawDate.match(/\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/g) || [];
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};
const formatDate = (date) => date ? parseDate(date) : null;

module.exports = {
    getUsersStandardLines,
    getOriginalDocument,
    standardLinesApiResponseMiddleware
};