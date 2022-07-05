jest.mock('../config.json', () => ({
    'TEST1': [
        {
            'validation': [],
            'props': {
                'label': 'Test Field 1'
            },
            'name': 'TestField1',
            'component': 'text'
        }
    ],
    'TEST2': [
        {
            'validation': [],
            'props': {
                'label': 'Test Field 1'
            },
            'name': 'TestField1',
            'component': 'radio'
        }
    ],
    'TEST3': [
        {
            'validation': [],
            'props': {
                'label': 'Test Field 1'
            },
            'name': 'TestField1',
            'component': 'text'
        },
        {
            'validation': [],
            'props': {
                'label': 'Test Field 2'
            },
            'name': 'TestField2',
            'component': 'text'
        }
    ]
}), { virtual: true });

const { fetchSearchFieldsForCaseTypes } = require('../searchFields');

describe('Search fields configuration', () => {

    describe('should return from config', () => {
        test('should return singular values', () => {
            const fields = fetchSearchFieldsForCaseTypes(['TEST1']);

            expect(fields.length).toEqual(1);
            expect(fields).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        'name': 'TestField1',
                        'component': 'text'
                    })
                ])
            );
        });
        test('should return existing casetype with one value not existent', () => {
            const fields = fetchSearchFieldsForCaseTypes(['TEST1', 'UNKNOWN']);

            expect(fields.length).toEqual(1);
            expect(fields).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        'name': 'TestField1',
                        'component': 'text'
                    })
                ])
            );
        });
        test('should return 2 of same field with different component', () => {
            const fields = fetchSearchFieldsForCaseTypes(['TEST1', 'TEST2']);

            expect(fields.length).toEqual(2);
            expect(fields).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        'name': 'TestField1',
                        'component': 'text'
                    }),
                    expect.objectContaining({
                        'name': 'TestField1',
                        'component': 'radio'
                    })
                ])
            );
        });
        test('should return concatenated list of fields across case types', () => {
            const fields = fetchSearchFieldsForCaseTypes(['TEST1', 'TEST3']);

            expect(fields.length).toEqual(2);
            expect(fields).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        'name': 'TestField1',
                        'component': 'text'
                    }),
                    expect.objectContaining({
                        'name': 'TestField2',
                        'component': 'text'
                    })
                ])
            );
        });
    });

    test('should return empty if not value in config', () => {
        const fields = fetchSearchFieldsForCaseTypes(['UNKNOWN']);

        expect(fields.length).toEqual(0);
    });

});
