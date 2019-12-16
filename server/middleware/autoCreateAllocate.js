const { actionResponseMiddleware, apiActionResponseMiddleware } = require('../middleware/action');
const { getFormForAction } = require('../services/form');
const tenantConfig = require('../tenantConfig');

async function autoCreateAllocate(req, res, next) {
    const { autoCreateAndAllocateEnabled } = await tenantConfig.layoutConfig();
    const { action, workflow } = req.params;

    try {
        if (autoCreateAndAllocateEnabled && workflow === 'create' && action === 'DOCUMENT') {
            return await getFormForAction(req, res, async () => await actionResponseMiddleware(req, res, next));
        }
        return next();
    } catch (e) {
        return next(e);
    }
}

async function autoCreateAllocateApi(req, res, next) {
    try {
        const { autoCreateAndAllocateEnabled } = await tenantConfig.layoutConfig();
        const { action, workflow } = req.params;

        if (autoCreateAndAllocateEnabled && workflow === 'create' && action === 'DOCUMENT') {
            return await getFormForAction(req, res, async () => await apiActionResponseMiddleware(req, res, next));
        }
        return next();
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    autoCreateAllocate,
    autoCreateAllocateApi
};
