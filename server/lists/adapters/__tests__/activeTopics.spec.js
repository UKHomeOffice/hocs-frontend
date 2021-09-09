const activeTopicAdapter = require('../activeTopics');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Topic foi Adapter', () => {
    it('should filter and sort topic data', async () => {


        const mockData = {
            parentTopics: [
                {
                    label: 'Parent B',
                    options: [
                        {
                            label: 'X Mock Label 1',
                            value: 'mock-value-1',
                            active: true
                        },
                        {
                            label: 'A Mock Label 2',
                            value: 'mock-value-2',
                            active: true
                        }
                    ]
                }, {
                    label: 'Parent A',
                    options: [
                        {
                            label: 'C Mock Label 3',
                            value: 'mock-value-3',
                            active: false
                        },
                        {
                            label: 'B Mock Label 4',
                            value: 'mock-value-4',
                            active: true
                        }
                    ]
                }
            ]
        };

        const expectedOutput = [
            {
                label: 'Parent A',
                options: [
                    {
                        label: 'B Mock Label 4',
                        value: 'mock-value-4',
                        active: true
                    }
                ]
            }, {
                label: 'Parent B',
                options: [
                    {
                        label: 'A Mock Label 2',
                        value: 'mock-value-2',
                        active: true
                    },
                    {
                        label: 'X Mock Label 1',
                        value: 'mock-value-1',
                        active: true
                    }
                ]
            }
        ];

        const results = await activeTopicAdapter(mockData, { logger: mockLogger });

        expect(results).toEqual(expectedOutput);
    });
});