const User = require('../models/user');
const { caseworkService } = require('../clients');

const allocationMiddleware = async (req, res, next) => {
    if (!req.query || !req.query.type) {
        return next(new Error(`Type not specified for case ${req.params.caseId} allocation`));
    }

    let redirectUrl;
    switch (req.query.type) {
        case 'OUT_OF_CONTACT':
            redirectUrl = await updateOutOfContact(req.body, req.params.caseId, req.params.stageId, req.requestId, req.user);
            break;
        default:
            return next(new Error(`Invalid type ${req.query.type} for case ${req.params.caseId} allocation`));
    }

    return res.json({ redirect: redirectUrl });
};

const updateOutOfContact = async (formBody, caseId, stageId, requestId, user) => {
    // If the case is out of contact then XOutOfContactPreviousTeam will have been set
    const previousTeamName = 'XOutOfContactPreviousTeam';
    const isOutOfContact = Boolean(formBody[previousTeamName]);
    const payload = {
        teamUUID: formBody[previousTeamName] ?? formBody['OutOfContactTeam']
    };

    await caseworkService.put(
        `/case/${caseId}/stage/${stageId}/team?saveLast=${!isOutOfContact}&saveLastFieldName=${previousTeamName}`,
        payload, { headers: { ...User.createHeaders(user), 'X-Correlation-Id': requestId } });

    return `/case/${caseId}/stage/${stageId}?tab=OUT_OF_CONTACT`;
};

module.exports = {
    allocationMiddleware
};
