const documentsAdapter = require('../documents');

const mockLogger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
};

describe('Documents Adapter', () => {

    it('should transform document data and sort by creation date descending', async () => {
        const mockData = {
            documents: [
                { created: '02-01-2019', displayName: 'Document A', type: 'type1', uuid: 1, status: 'PENDING', hasPdf: true, hasOriginalFile: true },
                { created: '01-01-2019', displayName: 'Document B', type: 'type1', uuid: 2, status: 'FAILED_CONVERSION', hasPdf: false, hasOriginalFile: true },
                { created: '03-01-2019', displayName: 'Document C', type: 'type2', uuid: 3, status: 'FAILED_VIRUS', labels: [], hasPdf: false, hasOriginalFile: false },
                { created: '03-01-2019', displayName: 'Document D', type: 'type2', uuid: 3, status: 'FAILED_MALWARE_SCAN', labels: [], hasPdf: false, hasOriginalFile: false },
                { created: '01-01-2019', displayName: 'Document E', type: 'type2', uuid: 4, status: 'INVALID', labels: undefined, hasPdf: false, hasOriginalFile: false },
                { created: '01-01-2019', displayName: 'Document F', type: 'type1', uuid: 5, status: 'AWAITING_MALWARE_SCAN', labels: ['Test Label'], hasPdf: false, hasOriginalFile: false },
                { created: '01-01-2019', displayName: 'Document G', type: 'type1', uuid: 5, status: 'AWAITING_CONVERSION', labels: ['Test Label'], hasPdf: false, hasOriginalFile: false }
            ],
            documentTags: ['type1', 'type2', 'type3']
        };

        const results = await documentsAdapter(mockData, { logger: mockLogger });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});
