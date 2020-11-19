const { caseworkService } = require('../clients');
const getLogger = require('../libs/logger');
const User = require('../models/user');
const { bindDisplayElements } = require('../lists/adapters/workstacks');
const { sortObjectByProp } = require('../libs/sortHelpers');
const { infoService } = require('../clients');

async function handleSearch(req, res, next) {
    const logger = getLogger(req.requestId);
    try {
        const formData = req.form.data;
        const request = {
            reference: formData['reference'] ? formData['reference'].toUpperCase() : '',
            caseType: formData['caseTypes'] ? formData['caseTypes'] : await req.listService.fetch('CASE_TYPES_COMMA_SEPARATED'),
            dateReceived: {
                to: formData['dateReceivedTo'],
                from: formData['dateReceivedFrom']
            },
            correspondentName: formData['correspondent'],
            correspondentNameNotMember: formData['correspondentNameNotMember'],
            correspondentReference: formData['correspondentReference'] ? formData['correspondentReference'].trim().toLowerCase() : '',
            correspondentExternalKey: formData['correspondentExternalKey'] ? await getMemberExternalKey(formData['correspondentExternalKey']) : undefined,
            topic: formData['topic'],
            data: {
                POTeamUUID: formData['signOffMinister'],
                FullName: formData['claimantName'],
                DateOfBirth: formData['claimantDOB'],
                NI: formData['niNumber'],
                PrevHocsRef: formData['PrevHocsRef'],
                RefType: formData['RefType'],
                HomeSecInterest: formData['HomeSecInterest'] === 'true' ? true : undefined,
                CampaignType: formData['CampaignType'],
                MinSignOffTeam: formData['MinSignOffTeam'],
                OfficialEngagement: formData['OfficialEngagement']
            },
            activeOnly: formData['caseStatus'] === 'active'
        };

        logger.info('SEARCH', { request });
        const response = await caseworkService.post('/search', request, {
            headers: User.createHeaders(req.user)
        });

        const fromStaticList = req.listService.getFromStaticList;

        const workstackData = await Promise.all(response.data.stages
            .sort(sortObjectByProp(workstackCase => workstackCase.caseReference))
            .map(bindDisplayElements(fromStaticList)));
        const { workstackTypeColumns } = await req.listService.fetch('S_SYSTEM_CONFIGURATION');
        // using DEFAULT columns for search
        const workstackTypeForSearch = workstackTypeColumns.find(
            item => item.workstackType === 'DEFAULT'
        );

        res.locals.workstack = {
            label: 'Search Results',
            items: workstackData,
            columns: workstackTypeForSearch.workstackColumns
        };

        next();
    } catch (error) {
        logger.error('SEARCH_FAILED', { message: error.message, stack: error.stack });
        next(error);
    }
}

async function getMemberExternalKey(memberUuid) {
    const response = await infoService.get(`/member/${memberUuid}`);
    return response.data.externalKey;
}

module.exports = {
    handleSearch
};
