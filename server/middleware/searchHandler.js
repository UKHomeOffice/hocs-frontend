const { caseworkService } = require('../clients');
const getLogger = require('../libs/logger');
const User = require('../models/user');
const { bindDisplayElements } = require('../lists/adapters/workstacks');

async function handleSearch(req, res, next) {
    const logger = getLogger(req.requestId);
    try {
        const formData = req.form.data;
        const request = {
            caseType: formData['caseTypes'],
            dateReceived: {
                to: formData['dateReceivedTo'],
                from: formData['dateReceivedFrom']
            },
            correspondentName: formData['correspondent'],
            topic: formData['topic'],
            data: {
                POTeamUUID: formData['signOffMinister'],
                FullName: formData['claimantName'],
                DateOfBirth: formData['claimantDOB'],
                NI: formData['niNumber'],
                PrevHocsRef: formData['PrevHocsRef']
            },
            activeOnly: Array.isArray(formData['caseStatus']) && formData['caseStatus'].includes('active')
        };

        logger.info('SEARCH', { request });
        const response = await caseworkService.post('/search', request, {
            headers: User.createHeaders(req.user)
        });

        const fromStaticList = req.listService.getFromStaticList;

        const workstackData = await Promise.all(response.data.stages
            .sort((first, second) => first.caseReference > second.caseReference)
            .map(bindDisplayElements(fromStaticList)));
        const { workstackColumns } = await req.listService.fetch('S_SYSTEM_CONFIGURATION');
        res.locals.workstack = {
            label: 'Search Results',
            items: workstackData,
            columns: workstackColumns
        };

        next();
    } catch (error) {
        logger.error('SEARCH_FAILED', { message: error.message, stack: error.stack });
        next(error);
    }
}


module.exports = {
    handleSearch
};