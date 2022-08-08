jest.mock('../config.json', () => ({
    'TEST1': [
        {
            'type': 'DOCUMENTS',
            'label': 'Document'
        }
    ] }),
{ virtual: true });

const { fetchCaseTabsForCaseType } = require('../caseTabs');

describe('Case Tabs configuration', () => {

    test('should return values if exists', () => {
        const tabs = fetchCaseTabsForCaseType(['TEST1']);

        expect(tabs.length).toEqual(1);
        expect(tabs).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    'type': 'DOCUMENTS',
                    'label': 'Document'
                })
            ])
        );
    });
    test('should return empty array if type non-existant', () => {
        const tabs = fetchCaseTabsForCaseType('UNKNOWN');

        expect(tabs.length).toEqual(0);
    });

});
