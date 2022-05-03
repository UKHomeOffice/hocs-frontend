const actionService = require('../services/action');
const { caseworkService, workflowService } = require('../clients');
const User = require('../models/user');
const { formatDate } = require('../libs/dateHelpers');
const { logger } = require('../libs/logger');

async function caseResponseMiddleware(req, res, next) {
    const { form, user } = req;
    try {
        const { callbackUrl } = await actionService.performAction('CASE', { ...req.params, form, user });
        return res.redirect(callbackUrl);
    } catch (error) {
        return next(error);
    }
}

async function caseApiResponseMiddleware(req, res, next) {
    const { form, user } = req;
    const { caseActionData } = res.locals;
    try {
        const { callbackUrl, confirmation } = await actionService.performAction('CASE', { ...req.params, form, user, caseActionData });

        if (confirmation) {
            return res.status(200).json({ confirmation });
        } else {
            return res.status(200).json({ redirect: callbackUrl });
        }
    } catch (error) {
        next(error);
    }
}

async function caseSummaryMiddleware(req, res, next) {
    try {
        const summary = await req.listService.fetch('CASE_SUMMARY', req.params);
        res.locals.summary = summary;
        next();
    } catch (error) {
        next(error);
    }
}

function caseSummaryApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.summary);
}

async function caseConfigMiddleware(req, res, next) {
    try {
        res.locals.caseConfig = await req.listService.fetch('CASE_CONFIG', req.params);
        next();
    } catch (error) {
        next(error);
    }
}

function caseConfigApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.caseConfig);
}

async function caseDataMiddleware(req, res, next) {
    try {
        res.locals.caseData = await req.listService.fetch('CASE_DATA', req.params);
        next();
    } catch (error) {
        next(error);
    }
}

function caseDataApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.caseData);
}

async function createCaseNote(req, res, next) {
    try {
        if (!req.body.caseNote) {
            res.locals.error = 'Case note must not be blank';
            next();
        }
        await caseworkService.post(`/case/${req.params.caseId}/note`, {
            text: req.body.caseNote,
            type: 'MANUAL'
        }, { headers: User.createHeaders(req.user) });
    } catch (error) {
        next(new Error(`Failed to attach case note to case ${req.params.caseId} `));
    }
    next();
}

async function updateCaseNote({ body: { caseNote }, params: { caseId, noteId }, user }, res, next) {
    try {
        if (!caseNote) {
            res.locals.error = 'Case note must not be blank';
            return next();
        }
        const updated = await caseworkService.put(`/case/${caseId}/note/${noteId}`, {
            text: caseNote,
            type: 'MANUAL'
        }, { headers: User.createHeaders(user) });
        res.locals.caseNote = updated.data;
    } catch (error) {
        return next(new Error(`Failed to update case note ${noteId} on case ${caseId} `));
    }
    return next();
}

function returnToCase(req, res) {
    res.redirect(`/case/${req.params.caseId}/stage/${req.params.stageId}`);
}

async function caseCorrespondentsMiddleware(req, res, next) {
    try {
        res.locals.correspondents = await req.listService.fetch('CASE_CORRESPONDENTS_ALL', req.params);
        next();
    } catch (error) {
        next(error);
    }
}

function caseCorrespondentsApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.correspondents);
}

async function caseActionDataMiddleware(req, res, next) {
    try {
        const preppedData = {};
        const actionData = await req.listService.fetch('CASE_ACTIONS', req.params);
        let uniqueActionTypeIds;
        let uniqueActionTypes;

        if (actionData && actionData.caseTypeActionData) {
            const actionTypeUUIDs = actionData.caseTypeActionData.map(type => type.uuid);
            uniqueActionTypeIds = [ ...new Set(actionTypeUUIDs) ];
            const actionTypes = actionData.caseTypeActionData.map(type => type.actionType);
            uniqueActionTypes = [ ...new Set(actionTypes) ];
        } else {
            logger.warn(`No case action data for caseId: ${req.params.caseId}`);
        }

        let actionDataArray = [];
        for (let actionType of Object.keys(actionData.caseActionData)) {
            actionDataArray = [ ...actionDataArray, ...actionData.caseActionData[actionType] ];
        }

        const collectedDataArray = [];
        for (let actionTypeId of uniqueActionTypeIds) {

            const temp = {
                id: actionTypeId,
                typeInfo: actionData.caseTypeActionData.find(type => type.uuid === actionTypeId),
                typeData: actionDataArray.filter(data => data.caseTypeActionUuid === actionTypeId)
            };

            collectedDataArray.push(temp);
        }

        for (let type of uniqueActionTypes) {
            preppedData[type] = collectedDataArray.filter(colDataEl => colDataEl.typeInfo.actionType === type);
        }

        preppedData.currentDeadline = formatDate(actionData.currentCaseDeadline);
        preppedData.remainingDays = actionData.remainingDaysUntilDeadline;

        res.locals.caseActionData = preppedData;
        next();
    } catch (error) {
        next(error);
    }
}

function caseActionApiResponseMiddleware(req, res) {
    return res.status(200).json(res.locals.caseActionData);
}

async function caseDataUpdateMiddleware(req, res, next) {
    try {
        let updated;
        if (req.query.type) {
            updated = await workflowService.put(`/case/${req.params.caseId}/stage/${req.params.stageId}/data?type=${req.query.type}`, req.body,
                { headers: User.createHeaders(req.user) });
        } else {
            updated = await workflowService.put(`/case/${req.params.caseId}/stage/${req.params.stageId}/data`, req.body,
                { headers: User.createHeaders(req.user) });
        }
        res.locals.formData = updated.data;
    } catch (error) {
        return next(new Error(`Failed to update case data on case ${req.params.caseId} `));
    }
    return next();
}

module.exports = {
    caseResponseMiddleware,
    caseApiResponseMiddleware,
    caseSummaryMiddleware,
    caseSummaryApiResponseMiddleware,
    createCaseNote,
    returnToCase,
    updateCaseNote,
    caseCorrespondentsMiddleware,
    caseCorrespondentsApiResponseMiddleware,
    caseActionDataMiddleware,
    caseActionApiResponseMiddleware,
    caseDataApiResponseMiddleware,
    caseDataMiddleware,
    caseDataUpdateMiddleware,
    caseConfigMiddleware,
    caseConfigApiResponseMiddleware,
};
