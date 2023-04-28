const { caseworkService } = require('../clients');
const User = require('../models/user');
const getLogger = require('../libs/logger');

async function getSomuItem({ caseId, somuTypeUuid, somuItemUuid, user, requestId }) {
    const response = await caseworkService.get(`/case/${caseId}/item/${somuTypeUuid}/${somuItemUuid}`,
        { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });

    getLogger(requestId).info('SOMU_ITEM_FETCHED', { somuItemUuid } );

    const { data } = response.data;
    try {
        return JSON.parse(data);
    } catch (e) {
        const logger = getLogger(requestId);
        logger.error('SOMU_ITEM_PARSE_FAILED', { somuItemUuid } );
        return undefined;
    }}

async function somuApiResponseMiddleware(req, res, next) {
    const { form, params: { caseId, stageId, somuItemUuid, somuTypeUuid } = {} } = req;

    try {
        let headers = {
            headers: { ...User.createHeaders(req.user), 'X-Correlation-Id': req.requestId }
        };

        await caseworkService.post(`/case/${caseId}/item/${somuTypeUuid}`, {
            uuid: somuItemUuid,
            data: JSON.stringify(form.data)
        }, headers);

        return res.status(200).json({ redirect: `/case/${caseId}/stage/${stageId}` });
    } catch (error) {
        next(error);
    }
}

module.exports = { somuApiResponseMiddleware, getSomuItem };
