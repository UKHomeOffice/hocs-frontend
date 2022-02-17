import updateSummary from '../summary-helpers';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
            case '/api/case/case1234/summary':
                return Promise.resolve({ data: { case: 'testCase' } });
            case '/api/case/case1235/summary':
                return Promise.reject({ response: 'Error' });
        }
    })
}));

describe('Summary helper', () => {

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
        await updateSummary(goodPage, mockDispatch);
        expect(axios.get).toHaveBeenCalledWith('/api/case/case1234/summary');
        expect(mockDispatch).toHaveBeenCalledWith({
            'payload': { 'case': 'testCase' },
            'type': 'UPDATE_CASE_SUMMARY'
        });
        expect(mockDispatch).toHaveBeenCalledWith({
            'type': 'UPDATE_API_STATUS',
            'payload': {
                'status': { display: 'Case summary received', level: 3, type: 'OK', timeoutPeriod: expect.any(Number) },
                'timeStamp': expect.any(Number)
            }
        });
    });

    it('should dispatch a failure action on request failure', async() => {
        await updateSummary(badPage, mockDispatch);

        expect(axios.get).toHaveBeenCalledWith('/api/case/case1235/summary');
        expect(mockDispatch).toHaveBeenCalledWith({
            'type': 'UPDATE_API_STATUS',
            'payload': {
                'status': { 'display': 'Unable to fetch case summary', 'level': 0, 'type': 'ERROR', 'timeoutPeriod': expect.any(Number) },
                'timeStamp': expect.any(Number)
            }
        });
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': 'Error', 'type': 'SET_ERROR' });
    });
});
