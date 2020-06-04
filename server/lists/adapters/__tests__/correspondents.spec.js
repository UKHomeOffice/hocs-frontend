const {
    caseCorrespondentAdapter,
    correspondentTypeAdapter,
    caseCorrespondentsAllAdapter
} = require('../correspondents');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Case Correspondent Adapter', () => {
    it('should transform and sort case correspondent data', async () => {
        const mockData = {
            correspondents: [
                { fullname: 'Correspondent A', uuid: 1 },
                { fullname: 'Correspondent B', uuid: 2 },
                { fullname: 'Correspondent C', uuid: 3 }
            ]
        };

        const results = await caseCorrespondentAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});

describe('Correspondent Type Adapter', () => {
    it('should transform and sort correspondent type data', async () => {
        const mockData = {
            correspondentTypes: [
                { uuid: 1234, displayName: 'Type A', type: 'TYPE_A' },
                { uuid: 1234, displayName: 'Type B', type: 'TYPE_B' },
                { uuid: 1234, displayName: 'Type C', type: 'TYPE_C' }
            ]
        };

        const results = await correspondentTypeAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});

describe('Case Correspondents All adapter', () => {
    it('should transform & reorder the data so the primary correspondent is the first object in the array', async () => {
        const mockData = {
            'correspondents': [
                {
                    'uuid': 'UUID_1',
                    'created': '2020-06-04T13:38:32.52298',
                    'type': 'MEMBER',
                    'caseUUID': 'CASE_UUID_1',
                    'fullname': 'fname1 lname1',
                    'address': {
                        'postcode': '',
                        'address1': '',
                        'address2': '',
                        'address3': '',
                        'country': ''
                    },
                    'telephone': '',
                    'email': '',
                    'reference': '',
                    'externalKey': null,
                    'isPrimary': false
                },
                {
                    'uuid': 'UUID_2',
                    'created': '2020-06-04T13:38:32.52298',
                    'type': 'MEMBER',
                    'caseUUID': 'CASE_UUID_2',
                    'fullname': 'fname2 lname2',
                    'address': {
                        'postcode': '',
                        'address1': '',
                        'address2': '',
                        'address3': '',
                        'country': ''
                    },
                    'telephone': '',
                    'email': '',
                    'reference': '',
                    'externalKey': null,
                    'isPrimary': true
                },
                {
                    'uuid': 'UUID_3',
                    'created': '2020-06-04T13:38:32.52298',
                    'type': 'MEMBER',
                    'caseUUID': 'CASE_UUID_3',
                    'fullname': 'fname3 lname3',
                    'address': {
                        'postcode': '',
                        'address1': '',
                        'address2': '',
                        'address3': '',
                        'country': ''
                    },
                    'telephone': '',
                    'email': '',
                    'reference': '',
                    'externalKey': null,
                    'isPrimary': false
                }
            ]
        };

        const results = await caseCorrespondentsAllAdapter(mockData, { logger: mockLogger });
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});
