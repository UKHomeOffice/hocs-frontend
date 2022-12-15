jest.mock('../tagConfig.json', () => ({
    'TEST': {
        'label': 'TEST-LABEL',
        'displayClass': 'TEST-DISPLAY-CLASS'
    }
}),
{ virtual: true });
const { fetchTagType } = require('../tagType');

describe('Tags configuration', () => {
    test('should return values if exists', () => {
        let tagDetails = fetchTagType('TEST');

        expect(tagDetails).toBeDefined();
        expect(tagDetails.label).toEqual('TEST-LABEL');
        expect(tagDetails.displayClass).toEqual('TEST-DISPLAY-CLASS');
    });

    test('should return empty array if type non-existent', () => {
        let tagDetails = fetchTagType('UNKNOWN');
        expect(tagDetails).toBeNull;
    });
});
