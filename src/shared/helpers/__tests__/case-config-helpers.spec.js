import updateConfig from '../case-config-helpers';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
            case '/api/case/case1234/config':
                return Promise.resolve({ data: { case: 'testCase' } }).catch((error) => logger.error(error));
            case '/api/case/case0000/config':
                return Promise.reject({ response: 'Error' }).catch((error) => logger.error(error));
        }
    })
}));

describe('Case config helper', () => {

    const goodPage = 'case1234';
    const badPage = 'case0000';

    let mockDispatch;

    beforeEach(() => {
        mockDispatch = jest.fn(() => Promise.resolve().catch((error) => logger.error(error)));
    });

    afterEach(() => {
        mockDispatch.mockReset();
        axios.get.mockClear();
    });

    it('should update the case config if a caseId is provided', async() => {
        await updateConfig(goodPage, mockDispatch);
        expect(axios.get).toHaveBeenCalledWith('/api/case/case1234/config');
        expect(mockDispatch).toHaveBeenCalledWith({
            'payload': { 'case': 'testCase' },
            'type': 'UPDATE_CASE_CONFIG'
        });
        expect(mockDispatch).toHaveBeenCalledWith({
            'type': 'UPDATE_API_STATUS',
            'payload': {
                'status': { display: 'Case config received', level: 1, type: 'OK', timeoutPeriod: expect.any(Number) },
                'timeStamp': expect.any(Number)
            }
        });
    });

    it('should dispatch a failure action on request failure', async() => {
        await updateConfig(badPage, mockDispatch);

        expect(axios.get).toHaveBeenCalledWith('/api/case/case0000/config');
        expect(mockDispatch).toHaveBeenCalledWith({
            'type': 'UPDATE_API_STATUS',
            'payload': {
                'status': { 'display': 'Unable to fetch case config', 'level': 0, 'type': 'ERROR', 'timeoutPeriod': expect.any(Number) },
                'timeStamp': expect.any(Number)
            }
        });
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': 'Error', 'type': 'SET_ERROR' });
    });
});
