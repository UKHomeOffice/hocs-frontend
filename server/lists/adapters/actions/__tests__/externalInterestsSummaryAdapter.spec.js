const interestsAdapter = require('../externalInterestsSummaryAdapter');


describe('externalInterestsSummaryAdapter.js', function () {

    it('should process the external interests', async () => {

        const actions = {
            caseActionData: {
                recordInterest: [{
                    caseTypeActionUuid: '0000-000',
                    caseTypeActionLabel: 'Action label 1',
                    interestedPartyEntity: {
                        title: 'Interested party 1'
                    },
                    detailsOfInterest: 'Details'
                }, {
                    caseTypeActionUuid: '0000-001',
                    caseTypeActionLabel: 'Action label 2',
                    interestedPartyEntity: {
                        title: 'Interested party 2'
                    },
                    detailsOfInterest: null
                }]
            },
        };

        const expectedResult = [
            {
                title: 'Action label 1',
                interestedPartyTitle: 'Interested party 1',
                detailsOfInterest: 'Details'
            },{
                title: 'Action label 2',
                interestedPartyTitle: 'Interested party 2',
                detailsOfInterest: null,
            }
        ];

        const output = await interestsAdapter(actions);
        expect(output).toEqual(expectedResult);
    });
});