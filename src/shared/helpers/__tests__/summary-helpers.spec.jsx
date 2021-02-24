import { updateSummary } from '../summary-helpers';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
            case '/api/case/case1234/summary':
                return Promise.resolve({ data: { case: 'testCase' } });
            case '/api/case/case1235/summary':
                return Promise.reject('Error');
        }
    })
}));

describe('FormEnabled page component', () => {

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
    });

    it('should dispatch a failure action on request failure', async() => {
        await updateSummary(badPage, mockDispatch);
        expect(axios.get).toHaveBeenCalledWith('/api/case/case1235/summary');

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ 'payload': { 'status': { 'display': 'Unable to submit form', 'level': 0, 'timeoutPeriod': expect.any(Number), 'type': 'ERROR' }, 'timeStamp': expect.any(Number) }, 'type': 'UPDATE_API_STATUS' }));
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': undefined, 'type': 'SET_ERROR' });
    });
});
