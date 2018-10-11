import React from 'react';
import WrappedWorkstackPage from '../workstack.jsx';

const BASE_URL = '/api';
const MOCK_MATCH = { url: '/test' };

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
        case '/api/test':
            return Promise.resolve({
                data: { label: 'Workstack', items: [] }
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
jest.mock('../../common/components/workstack.jsx', () => () => 'MOCK_WORKSTACK');
jest.mock('../../contexts/actions/index.jsx', () => ({
    updateApiStatus: jest.fn(),
    clearApiStatus: jest.fn(),
    updateWorkstack: jest.fn(),
    clearWorkstack: jest.fn(),
}));

import axios from 'axios';
import actions from '../../contexts/actions/index.jsx';
const FLUSH_PROMISES = () => new Promise(resolve => setImmediate(resolve));

describe('Workstack page component', () => {

    const MOCK_DISPATCH = jest.fn();

    beforeEach(() => {
        MOCK_DISPATCH.mockReset();
        MOCK_DISPATCH.mockReturnValue(Promise.resolve());
        axios.get.mockClear();
        actions.updateWorkstack.mockReset();
    });

    it('should render with default props', async () => {
        const OUTER = shallow(<WrappedWorkstackPage match={MOCK_MATCH} />);
        const WorkstackPage = OUTER.props().children;
        const WRAPPER = mount(
            <WorkstackPage dispatch={MOCK_DISPATCH} />
        );
        await FLUSH_PROMISES();
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
        expect(MOCK_DISPATCH).toHaveBeenCalled();
        expect(actions.updateWorkstack).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(BASE_URL + MOCK_MATCH.url);
    });

    it('should should not call workstack endpoint if data exists in props', async () => {
        const MOCK_WORKSTACK_DATA = { label: 'Workstack', items: [] };
        const OUTER = shallow(<WrappedWorkstackPage  match={MOCK_MATCH} />);
        const WorkstackPage = OUTER.props().children;
        const WRAPPER = mount(
            <WorkstackPage dispatch={MOCK_DISPATCH} workstack={MOCK_WORKSTACK_DATA} />
        );
        await FLUSH_PROMISES();
        expect(WRAPPER).toBeDefined();
        expect(MOCK_DISPATCH).not.toHaveBeenCalled();
        expect(actions.updateWorkstack).not.toHaveBeenCalled();
        expect(axios.get).not.toHaveBeenCalled();
    });

});