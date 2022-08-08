import updateTabs from '../case-tabs-helpers';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
            case '/api/case/case1234/tabs':
                return Promise.resolve({ data: { case: 'testCase' } });
            case '/api/case/case0000/tabs':
                return Promise.reject({ response: 'Error' });
        }
    })
}));

describe('Case config helper', () => {
    const goodPage = 'case1234';
    const badPage = 'case0000';

    let mockDispatch;

    beforeEach(() => {
        mockDispatch = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        mockDispatch.mockReset();
        axios.get.mockClear();
    });

    it('should update the case config if a caseId is provided', async() => {
        await updateTabs(goodPage, mockDispatch);
        expect(axios.get).toHaveBeenCalledWith('/api/case/case1234/tabs');
        expect(mockDispatch).toHaveBeenCalledWith({
            'payload': { 'case': 'testCase' },
            'type': 'UPDATE_CASE_TABS'
        });
    });

    it('should dispatch a failure action on request failure', async() => {
        await updateTabs(badPage, mockDispatch);

        expect(axios.get).toHaveBeenCalledWith('/api/case/case0000/tabs');
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': 'Error', 'type': 'SET_ERROR' });
    });
});
