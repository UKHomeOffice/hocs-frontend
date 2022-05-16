import React from 'react';
const BASE_URL = '/api';
const MOCK_MATCH = { url: '/standard-lines' };

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
            case '/user/__TEST__/standardLine':
                return Promise.resolve({
                    data: [{
                        uuid: 'test',
                        displayName: 'test',
                        topicUUID: 'test',
                        expires: '9999-12-31',
                        documentUUID: 'test'
                    }]
                });
            default:
                return Promise.reject({
                    response: {
                        data: {}
                    }
                });
        }
    })
}));
jest.mock('../../contexts/actions/index.jsx', () => ({
    updateApiStatus: jest.fn(),
    clearApiStatus: jest.fn(),
}));

import axios from 'axios';
import WrappedStandardLines from '../standardLines/standardLinesView.jsx';
const FLUSH_PROMISES = () => new Promise(resolve => setImmediate(resolve));

describe('Workstack page component', () => {

    const MOCK_DISPATCH = jest.fn();

    beforeEach(() => {
        MOCK_DISPATCH.mockReset();
        MOCK_DISPATCH.mockReturnValue(Promise.resolve());
        axios.get.mockClear();
    });

    it('should render with default props', async () => {
        const OUTER = shallow(<WrappedStandardLines match={MOCK_MATCH}/>);
        const StandardLinesPage = OUTER.props().children;
        const WRAPPER = mount(
            <StandardLinesPage dispatch={MOCK_DISPATCH} />
        );
        await FLUSH_PROMISES();
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
        expect(MOCK_DISPATCH).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(BASE_URL + MOCK_MATCH.url);
    });
});
