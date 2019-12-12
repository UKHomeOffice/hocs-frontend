async function skipCaseTypePageApi(req, res, next) {
    const workflow = req.params.workflow;
    const action = req.params.action;
    if (workflow === 'create' && action === 'workflow') {
        try {
            const caseTypes = await req.listService.fetch('S_CASETYPES');
            if (caseTypes.length === 1) {
                return res.json({ redirect: `/action/create/${caseTypes[0].key}/DOCUMENT` });
            }
        } catch (e) {
            return next(e);
        }
    }
    return next();
}

async function skipCaseTypePage(req, res, next) {
    const workflow = req.params.workflow;
    const action = req.params.action;
    if (workflow === 'create' && action === 'workflow') {
        try {
            const caseTypes = await req.listService.fetch('S_CASETYPES');
            if (caseTypes.length === 1) {
                const url = `/action/create/${caseTypes[0].key}/DOCUMENT`;
                return res.redirect(url);
            }
        } catch (e) {
            return next(e);
        }
    }
    return next();
}

module.exports = {
    skipCaseTypePage,
    skipCaseTypePageApi
};
