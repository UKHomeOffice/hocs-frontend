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
            { label: 'Type A', value: 'TYPE_A' },
            { label: 'Type B', value: 'TYPE_B' },
            { label: 'Type C', value: 'TYPE_C' }
        ];

        const results = await correspondentTypeAdapter(mockData);
        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});