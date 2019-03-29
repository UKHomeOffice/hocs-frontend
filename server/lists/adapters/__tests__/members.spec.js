const membersAdapter = require('../members');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Members Adapter', () => {

    it('should transform member data', async () => {
        const mockData = {
            members: [
                { group: 'A', label: 'Member 1', value: 'MEMBER_1' },
                { group: 'A', label: 'Member 2', value: 'MEMBER_2' },
                { group: 'B', label: 'Member 3', value: 'MEMBER_3' },
                { group: 'C', label: 'Member 4', value: 'MEMBER_4' }
            ]
        };

        const results = await membersAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});