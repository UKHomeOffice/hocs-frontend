const caseViewAllStagesAdapter = require('../case-view-all-stages');

const mockFromStaticList = jest.fn((list, stageId) => stageId);
const mockData = {
    caseReference: 'MIN/1234567/18',
    schema: {
        title: 'View Case',
        fields: {
            STAGE_NAME2: [
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
            ],
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
            ],
            STAGE_NAME1: [
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

describe('Case-view-all-stages Adapter', () => {
    it('should build a schema from the provided template and have sections in alphabetical order', async () => {

        const result = await caseViewAllStagesAdapter(mockData, { fromStaticList: mockFromStaticList });

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });
});
