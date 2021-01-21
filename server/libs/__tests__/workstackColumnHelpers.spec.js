const { extractWorkstackTypeColumns } = require('../workstackColumnHelpers');

describe('Workstack Type Columns helper', () => {
    it('should return the specific workstack for the case type if it exists', () => {
        const workstackTypeColumns = [
            { workstackType: 'DEFAULT', workstackColumns: {} },
            { workstackType: 'testType_SEARCH_RESULTS', workstackColumns: {} }
        ];

        const result = extractWorkstackTypeColumns('SEARCH_RESULTS')(workstackTypeColumns,  { caseType: 'testType' } );

        expect(result).toEqual({ workstackType: 'testType_SEARCH_RESULTS', workstackColumns: {} } );
    });

    it('should return the default workstack if a specific one for the case type does not exist', () => {
        const workstackTypeColumns = [
            { workstackType: 'DEFAULT', workstackColumns: {} },
            { workstackType: 'testType_SEARCH_RESULTS', workstackColumns: {} }
        ];

        const result = extractWorkstackTypeColumns('SEARCH_RESULTS')(workstackTypeColumns,  { caseType: 'testType2' } );

        expect(result).toEqual({ workstackType: 'DEFAULT', workstackColumns: {} } );
    });
});
