const appealsAdapter = require('../appealsSummaryAdapter');

const mockFetchList = jest.fn((list) => {

    switch (list) {
        case 'OFFICER_CHOICES':
            return [{
                value: '000000-00000-00000',
                label: 'Officer\'s Name',
            }, {
                value: '000000-00000-00001',
                label: 'Officer\'s Name 2'
            }];
        case 'DIRECTORATE_CHOICES':
            return [{
                value: 'SOME_OTHER_DIRECTORATE',
                label: 'Directorate 1',
            }, {
                value: 'SOME_DIRECTORATE',
                label: 'Directorate 2'
            }];
    }
});



describe('appealsSummaryAdapter.js', function () {

    it('should process the appeals', async () => {

        const actions = {
            caseActionData: {
                appeals: [{
                    caseTypeActionUuid: '0000-000',
                    caseTypeActionLabel: 'Appeal Type A',
                    appealOfficerData: JSON.stringify({
                        OfficerValue: '000000-00000-00000',
                        DirectorateValue: 'SOME_DIRECTORATE'
                    }),
                    outcome: null,
                    status: 'Pending',
                    complexCase: null,
                    note: null,
                    dateSentRMS: null
                }, {
                    caseTypeActionUuid: '0000-001',
                    caseTypeActionLabel: 'Appeal Type B',
                    appealOfficerData: JSON.stringify({
                        OfficerValueB: '000000-00000-00000',
                        DirectorateValueB: 'SOME_DIRECTORATE'
                    }),
                    outcome: 'DecisionPartUpheld',
                    status: 'Complete',
                    complexCase: 'Yes',
                    note: 'Some note detailing things',
                    dateSentRMS: '2021-11-09'
                }]
            },
            caseTypeActionData: [
                {
                    uuid: '0000-000',
                    props: JSON.stringify({
                        appealOfficerData: {
                            officer: {
                                choices: 'OFFICER_CHOICES',
                                value: 'OfficerValue'
                            },
                            directorate: {
                                choices: 'DIRECTORATE_CHOICES',
                                value: 'DirectorateValue'
                            }
                        }
                    }),
                }, {
                    uuid: '0000-001',
                    props: JSON.stringify({
                        appealOfficerData: {
                            officer: {
                                choices: 'OFFICER_CHOICES',
                                value: 'OfficerValueB'
                            },
                            directorate: {
                                choices: 'DIRECTORATE_CHOICES',
                                value: 'DirectorateValueB'
                            }
                        }
                    }),
                }
            ],
        };

        const expectedResult = [
            {
                title: 'Appeal Type A',
                outcome: null,
                officerDirectorate: 'Directorate 2',
                officer: 'Officer\'s Name',
                status: 'No',
                complexCase: null,
                note: null,
                dateSentRMS: null
            },{
                title: 'Appeal Type B',
                outcome: 'Decision upheld in part',
                officerDirectorate: 'Directorate 2',
                officer: 'Officer\'s Name',
                status: 'Yes',
                complexCase: 'Yes',
                note: 'Some note detailing things',
                dateSentRMS: '09/11/2021'
            }
        ];

        const output = await appealsAdapter(actions, mockFetchList);
        expect(output).toEqual(expectedResult);
    });
});