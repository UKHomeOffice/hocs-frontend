import React from 'react';
import WrappedDashboardPage from '../dashboard.jsx';

const DASHBOARD_ENDPOINT = '/api/dashboard';

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
        case '/api/dashboard':
            return Promise.resolve({
                data: {}
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
jest.mock('../../common/components/dashboard.jsx',  () => () => 'MOCK_DASHBOARD');
jest.mock('../../contexts/actions/index.jsx', () => ({
    updateApiStatus: jest.fn(),
    clearApiStatus: jest.fn(),
    updateDashboard: jest.fn(),
    clearDashboard: jest.fn()
}));

import axios from 'axios';
import actions from '../../contexts/actions/index.jsx';
const FLUSH_PROMISES = () => new Promise(resolve => setImmediate(resolve));

describe('Dashboard page component', () => {

    const MOCK_DISPATCH = jest.fn();

    beforeEach(() => {
        MOCK_DISPATCH.mockReset();
        MOCK_DISPATCH.mockReturnValue(Promise.resolve());
        axios.get.mockClear();
        actions.updateDashboard.mockReset();
    });

    it('should render with default props', async () => {
        const OUTER = shallow(<WrappedDashboardPage />);
        const DashboardPage = OUTER.props().children;
        const WRAPPER = mount(
            <DashboardPage dispatch={MOCK_DISPATCH} />
        );
        await FLUSH_PROMISES();
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
        expect(MOCK_DISPATCH).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(DASHBOARD_ENDPOINT);
    });

    it('should should not call dashboard endpoint if data exists in props', async () => {
        const MOCK_DASHBOARD_DATA = {
            user: { label: 'My cases', count: 0, items: [] },
            teams: []
        };
        const OUTER = shallow(<WrappedDashboardPage />);
        const DashboardPage = OUTER.props().children;
        const WRAPPER = mount(
            <DashboardPage dispatch={MOCK_DISPATCH} dashboard={MOCK_DASHBOARD_DATA} />
        );
        await FLUSH_PROMISES();
        expect(WRAPPER).toBeDefined();
        expect(MOCK_DISPATCH).toHaveBeenCalled();
        expect(MOCK_DISPATCH).toHaveBeenCalledWith(actions.clearDashboard());
        expect(axios.get).not.toHaveBeenCalled();
    });

});