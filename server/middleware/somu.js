const { caseworkService } = require('../clients');
const User = require('../models/user');
const getLogger = require('../libs/logger');

async function getSomuItem({ caseId, somuTypeUuid, somuItemUuid, user, requestId }) {
    const response = await caseworkService.get(`/case/${caseId}/item/${somuTypeUuid}/${somuItemUuid}`,
        { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });

    const { data } = response.data;
    try {
        return JSON.parse(data);
    } catch (e) {
        const logger = getLogger(requestId);
        logger.error('SOMU_ITEM_PARSE_FAILED', { somuItemUuid } );
        return undefined;
    }}

async function somuApiResponseMiddleware(req, res, next) {
    const { form, user, params: { caseId, stageId, somuItemUuid, somuTypeUuid } = {} } = req;

    try {
        let headers = {
            headers: User.createHeaders(user)
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
