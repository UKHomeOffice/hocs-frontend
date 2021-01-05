const actionService = require('../services/action');
const { caseworkService } = require('../clients');
const User = require('../models/user');
const getLogger = require('../libs/logger');
const { somuItemsAdapter } = require('../lists/adapters/somu');

async function getSomuItems({ caseId, somuTypeUuid, user, requestId }) {
    const logger = getLogger(requestId);

    const response = await caseworkService.get(`/case/${caseId}/item/${somuTypeUuid}`,
        { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });

    if (response) {
        const somuItems = response.data;

        if (somuItems) {
            const parsedData = await somuItemsAdapter(somuItems, { logger });

            if (Array.isArray(parsedData)) {
                return parsedData;
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
    const { form, user, params, requestId } = req;

    const dataItems = await getSomuItems({ ...params, user, requestId });

    if (params.somuItemUuid) {
        let itemIndex = dataItems.findIndex(x => x.uuid === params.somuItemUuid);

        if (itemIndex !== -1) {
            dataItems[itemIndex] = { ...dataItems[itemIndex], data: { ...form.data } };
        } else {
            const item = { data: form.data };
            dataItems.push(item);
        }
    } else {
        const item = { data: form.data };
        dataItems.push(item);
    }

    try {
        const { callbackUrl } =
            await actionService.performAction('CASE', { ...req.params, form, somuItemData: JSON.stringify(form.data), somuTypeItems: JSON.stringify(dataItems), user });
        return res.status(200).json({ redirect: callbackUrl });
    } catch (error) {
        next(error);
    }
}

module.exports = { somuApiResponseMiddleware, getSomuItem };
