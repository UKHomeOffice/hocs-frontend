const topicsfoiAdapter = require('../topicsfoi');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Topic foi Adapter', () => {
    it('should filter and sort topic data', async () => {
        const mockData = [
            {
                label: 'Police National Computer Records – retention',
                value: 'd1252b60-85ad-434a-af95-da408cb516d3',
                active: 'false'
            },
            {
                label: 'Police Pay and Conditions',
                value: '8b3b91c8-ad1c-4e06-a336-c0733ca27769',
                active: 'true'
            },
            {
                label: 'Planning out crime / Safer places - environmental design/planning in crime prevention.',
                value: '58fcbb19-78bf-423c-bb22-23ecca2107a2',
                active: 'false'
            },
            {
                label: 'Co-ordination of government response to incident',
                value: '07eaf080-a2d9-455f-bfb4-e8b48a37853a',
                active: 'false'
            }
        ];

        const results = await topicsfoiAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});