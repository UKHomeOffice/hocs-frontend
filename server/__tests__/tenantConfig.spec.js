import tenantConfig from '../tenantConfig';
const listService = require('../services/list');

const MOCK_FETCH = jest.fn();

jest.mock('../services/list', () => ({
    getInstance: jest.fn(() => {
        return {
            fetch: MOCK_FETCH
        };
    })
}));

describe('Tenant Config', () => {

    it('should return layout config', async () => {
        MOCK_FETCH.mockReset();
        MOCK_FETCH.mockReturnValue(Promise.resolve({
            displayName: 'System Name', bulkCreateEnabled: true
        }));
        const layout = await tenantConfig.layoutConfig();
        expect(layout).toBeDefined();
        expect(layout.header.service).toEqual('System Name');
        expect(layout.header.bulkCreateEnabled).toEqual(true);
        expect(listService.getInstance).toHaveBeenCalled();
        expect(MOCK_FETCH).toHaveBeenCalled();
    });

    it('should fail to return layout config when fetch is rejected', async () => {
        MOCK_FETCH.mockReset();
        const mockError = new Error('TEST_ERROR');
        MOCK_FETCH.mockReturnValue(Promise.reject(mockError));
        expect(tenantConfig.layoutConfig()).rejects.toEqual(mockError);
        expect(listService.getInstance).toHaveBeenCalled();
        expect(MOCK_FETCH).toHaveBeenCalled();
    });

    it('should return render config', async () => {
        MOCK_FETCH.mockReset();
        MOCK_FETCH.mockReturnValue(Promise.resolve({
            displayName: 'System Name', bulkCreateEnabled: true
        }));
        const renderConfig = await tenantConfig.renderConfig();
        expect(renderConfig).toBeDefined();
        expect(renderConfig.clientSide).toEqual(true);
        expect(renderConfig.js).toEqual(['runtime', 'vendor']);
        expect(renderConfig.css).toEqual(['main']);
        expect(renderConfig.react).toEqual('main');
        expect(renderConfig.title).toEqual('System Name');
        expect(listService.getInstance).toHaveBeenCalled();
        expect(MOCK_FETCH).toHaveBeenCalled();

    });

    it('should fail to return render config when fetch is rejected', async () => {
        MOCK_FETCH.mockReset();
        const mockError = new Error('TEST_ERROR');
        MOCK_FETCH.mockReturnValue(Promise.reject(mockError));
        expect(tenantConfig.renderConfig()).rejects.toEqual(mockError);
        expect(listService.getInstance).toHaveBeenCalled();
        expect(MOCK_FETCH).toHaveBeenCalled();
    });

});