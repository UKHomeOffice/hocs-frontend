const caseViewReadOnlyAdapter = require('../case-view-read-only');

const mockData = {
    schema: {
        title: 'MIN/1234567/18',
        fields: [
            {
                component: 'accordion',
                props: {
                    name: 'Accordion',
                    sections: [
                        {
                            title: 'titleA',
                            items: [
                                {
                                    component: 'text',
                                    validation: ['required'],
                                    props: {
                                        name: 'fieldA',
                                        label: 'My Field A'
                                    },
                                },
                                {
                                    component: 'date',
                                    validation: ['required'],
                                    props: {
                                        name: 'dateFieldA',
                                        label: 'My Date Field A'
                                    },
                                },
                                {
                                    component: 'text',
                                    validation: ['required'],
                                    props: {
                                        name: 'emptyFieldA',
                                        label: 'My Empty Field A'
                                    },
                                },
                            ],
                        },
                        {
                            title: 'titleB',
                            items: [
                                {
                                    component: 'text',
                                    validation: ['required'],
                                    props: {
                                        name: 'fieldB',
                                        label: 'My Field B'
                                    },
                                },
                                {
                                    component: 'date',
                                    validation: ['required'],
                                    props: {
                                        name: 'dateFieldB',
                                        label: 'My Date Field  B'
                                    },
                                },
                                {
                                    component: 'text',
                                    validation: ['required'],
                                    props: {
                                        name: 'emptyFieldB',
                                        label: 'My Empty Field B'
                                    },
                                },
                            ],
                        },
                        {
                            title: 'titleC',
                            items: [
                                {
                                    component: 'text',
                                    validation: ['required'],
                                    props: {
                                        name: 'fieldC',
                                        label: 'My Field C'
                                    },
                                },
                                {
                                    component: 'date',
                                    validation: ['required'],
                                    props: {
                                        name: 'dateFieldC',
                                        label: 'My Date Field C'
                                    },
                                },
                                {
                                    component: 'text',
                                    validation: ['required'],
                                    props: {
                                        name: 'emptyFieldC',
                                        label: 'My Empty Field C'
                                    },
                                },
                            ]
                        },
                    ],
                },
            },
        ],
    },
    data: {
        fieldA: 'Some Value A',
        fieldB: 'Some Value B',
        fieldC: 'Some Value C',
        dateFieldA: '2020-01-19',
        dateFieldB: '2020-01-20',
        dateFieldC: '2020-01-21',
    }
};

describe('Case-view-read-only Adapter', () => {
    it('should build a schema from the provided template', async () => {

        const result = await caseViewReadOnlyAdapter(mockData);

        expect(result).toBeDefined();
        expect(result).toMatchSnapshot();
    });
});
