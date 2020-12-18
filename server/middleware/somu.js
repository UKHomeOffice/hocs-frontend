const actionService = require('../services/action');
const { caseworkService } = require('../clients');
const uuid = require('uuid/v4');
const User = require('../models/user');
const getLogger = require('../libs/logger');

async function getSomuItems({ caseId, somuTypeUuid, user, requestId }) {
    const logger = getLogger(requestId);

    const response = await caseworkService.get(`/case/${caseId}/item/${somuTypeUuid}`,
        { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });

    if (response) {
        const mainSomuItem = response.data;

        if (mainSomuItem && mainSomuItem.data) {
            try {
                const parsedData = JSON.parse(mainSomuItem.data);

                if (Array.isArray(parsedData)) {
                    return parsedData;
                }
            } catch (error) {
                logger.error('GETSOMUITEMS_FAILED', { message: `Could not parse data: ${mainSomuItem.data}, returning empty array.` });
            }
        }
    }
    return [];
}

async function getSomuItem({ caseId, somuTypeUuid, somuItemUuid, user, requestId }) {
    const somuItems = await getSomuItems({ caseId, somuTypeUuid, user, requestId });
    return somuItems.find(x => x.uuid === somuItemUuid);
}

async function somuApiResponseMiddleware(req, res, next) {
    const { form, user, params, requestId, body } = req;

    const dataItems = await getSomuItems({ ...params, user, requestId });

    if (body.uuid) {
        let itemIndex = dataItems.findIndex(x => x.uuid === body.uuid);
        if (itemIndex !== -1) {
            dataItems[itemIndex] = { uuid: dataItems[itemIndex].uuid, ...form.data };
        } else {
            const item = { uuid: uuid(), ...form.data };
            dataItems.push(item);
        }
    } else {
        const item = { uuid: uuid(), ...form.data };
        dataItems.push(item);
    }

    try {
        const { callbackUrl } = await actionService.performAction('CASE', { ...req.params, form, somuItemData: JSON.stringify(dataItems), user });
        return res.status(200).json({ redirect: callbackUrl });
    } catch (error) {
        next(error);
    }
}

module.exports = { somuApiResponseMiddleware, getSomuItem };