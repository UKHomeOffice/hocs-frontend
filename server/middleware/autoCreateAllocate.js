const { actionResponseMiddleware, apiActionResponseMiddleware } = require('../middleware/action');
const { getFormForAction } = require('../services/form');
const tenantConfig = require('../tenantConfig');

async function autoCreateAllocateBrowser(req, res, next) {
    return await autoCreateAllocate(req, res, next, actionResponseMiddleware);
}

async function autoCreateAllocateApi(req, res, next) {
    return await autoCreateAllocate(req, res, next, apiActionResponseMiddleware);
}

async function autoCreateAllocate(req, res, next, responseMiddleware) {
    try {
        const { autoCreateAndAllocateEnabled } = await tenantConfig.layoutConfig();
        const { action = '', workflow = '' } = req.params;

        if (autoCreateAndAllocateEnabled && workflow.toLocaleUpperCase() === 'CREATE' && action.toLocaleUpperCase() === 'DOCUMENT') {
            return await getFormForAction(req, res, async () => await responseMiddleware(req, res, next));
        }
        return next();
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    autoCreateAllocateApi,
    autoCreateAllocateBrowser,
};
