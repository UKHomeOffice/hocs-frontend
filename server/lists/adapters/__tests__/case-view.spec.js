const caseViewAdapter = require('../case-view');

const mockFromStaticList = jest.fn((list, stageId) => stageId);

describe('Case-view Adapter', () => {
    it('should build a schema from the provided template', async () => {
        const mockData = {
            caseReference: 'MIN/1234567/18',
            schema: {
                title: 'View Case',
                fields: {
                    STAGE_NAME: [
                        {
                            component: 'text',
                            validation: ['required'],
                            props: {
                                name: 'my_field',
                                label: 'My Field'
                            },
                        },
                        {
                            component: 'date',
                            validation: ['required'],
                            props: {
                                name: 'my_date_field',
                                label: 'My Date Field'
                            },
                        },
                        {
                            component: 'text',
                            validation: ['required'],
                            props: {
                                name: 'my_empty_field',
                                label: 'My Empty Field'
                            },
                        },
                    ]
                }
            },
            data: {
                my_field: 'Some Value',
                my_date_field: '2020-01-19'
            }
        };

        const result = await caseViewAdapter(mockData, { fromStaticList: mockFromStaticList });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });
});