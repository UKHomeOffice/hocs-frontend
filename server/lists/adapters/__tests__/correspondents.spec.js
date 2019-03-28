const { caseCorrespondentAdapter, correspondentTypeAdapter } = require('../correspondents');

describe('Case Correspondent Adapter', () => {
    it('should transform and sort case correspondent data', async () => {
        const mockData = {
            correspondents: [
                { fullname: 'Correspondent A', uuid: 1 },
                { fullname: 'Correspondent B', uuid: 2 },
                { fullname: 'Correspondent C', uuid: 3 }
            ]
        };

        const results = await caseCorrespondentAdapter(mockData);
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});

describe('Correspondent Type Adapter', () => {
    it('should transform and sort correspondent type data', async () => {
        const mockData = [
            { uuid: 1234, displayName: 'Type A', type: 'TYPE_A' },
            { uuid: 1234, displayName: 'Type B', type: 'TYPE_B' },
            { uuid: 1234, displayName: 'Type C', type: 'TYPE_C' }
        ];

        const results = await correspondentTypeAdapter(mockData);
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});