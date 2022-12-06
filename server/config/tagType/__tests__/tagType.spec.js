jest.mock('../tagConfig.json', () => ({
    'TEST': [
    {
        'tagName': 'NAME',
        'tagLabel': 'TEST-LABEL'
    }
    ],
    '': [
    {
        'tagName': 'default',
        'tagLabel': 'default-label'
    }]
}),
    { virtual: true });
const { fetchTagType } = require('../tagType');

describe('Tags configuration', () => {
    test('should return values if exists', () => {
        const tag = fetchTagType(['TEST']);

        expect(tag.length).toEqual(1);
        expect(tag).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    'tagName': 'NAME',
                    'tagLabel': 'TEST-LABEL'
                })
            ])
        );
    });

    test('should return default values if exists', () => {
        const tag = fetchTagType(['']);

        expect(tag.length).toEqual(1);
        expect(tag).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    'tagName': 'default',
                    'tagLabel': 'default-label'
                })
            ])
        );
    });


    test('should return empty array if type non-existent', () => {
        let tag;
        tag = fetchTagType('UNKNOWN');
        expect(tag.length).toEqual(0);
    });
});
