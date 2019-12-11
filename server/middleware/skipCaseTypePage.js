async function skipCaseTypePage(req, res, next) {
    const workflow = req.params.workflow;
    const action = req.params.action;
    if (workflow === 'create' && action === 'workflow') {
        try {
            const caseTypes = await req.listService.fetch('S_CASETYPES');
            if (caseTypes.length === 1) {
                res.json({ redirect: `/action/create/${caseTypes[0].key}/DOCUMENT` });
            } else {
                next();
            }
        } catch (e) {
            next(e);
        }
    }
}

async function skipCaseTypePageOnReload(req, res, next) {
    const workflow = req.params.workflow;
    const action = req.params.action;
    if (workflow && action ) {
        try {
            const caseTypes = await req.listService.fetch('S_CASETYPES');
            if (caseTypes.length === 1) {
                res.json({ redirect: `/action/create/${caseTypes[0].key}/DOCUMENT` });
            } else {
                next();
            }
        } catch (e) {
            next(e);
        }
    }
}

module.exports = {
    skipCaseTypePage,
    skipCaseTypePageOnReload
};