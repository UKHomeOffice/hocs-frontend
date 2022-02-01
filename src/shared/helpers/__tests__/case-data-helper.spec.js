import getCaseData from '../case-data-helper';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
            case '/api/case/case1234/':
                return Promise.resolve({ data: { case: 'testCase' } });
            case '/api/case/case1235/':
                return Promise.reject({ response: 'Error' });
        }
    })
}));

describe('Case data helper', () => {

    const goodPage = 'case1234';
    const badPage = 'case1235';

    let mockDispatch;

    beforeEach(() => {
        mockDispatch = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        mockDispatch.mockReset();
        axios.get.mockClear();
    });

    it('should update the summary if a caseId is provided', async() => {
        await getCaseData(goodPage, mockDispatch);
        expect(axios.get).toHaveBeenCalledWith('/api/case/case1234/');
        expect(mockDispatch).toHaveBeenCalledWith({
            'payload': { 'case': 'testCase' },
            'type': 'UPDATE_CASE_DATA'
        });
        expect(mockDispatch).toHaveBeenCalledWith({
            'type': 'UPDATE_API_STATUS',
            'payload': {
                'status': { display: 'Case data received', level: 3, type: 'OK', timeoutPeriod: expect.any(Number) },
                'timeStamp': expect.any(Number)
            }
        });
    });

    it('should dispatch a failure action on request failure', async() => {
        await getCaseData(badPage, mockDispatch);

        expect(axios.get).toHaveBeenCalledWith('/api/case/case1235/');
        expect(mockDispatch).toHaveBeenCalledWith({
            'type': 'UPDATE_API_STATUS',
            'payload': {
                'status': { 'display': 'Unable to fetch case data', 'level': 0, 'type': 'ERROR', 'timeoutPeriod': expect.any(Number) },
                'timeStamp': expect.any(Number)
            }
        });
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': 'Error', 'type': 'SET_ERROR' });
    });
});
