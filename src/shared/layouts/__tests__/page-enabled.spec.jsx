import React from 'react';
import WrappedPage from '../page-enabled';

jest.mock('../error.jsx', () => () => 'MOCK_ERROR_PAGE');
jest.mock('../../contexts/actions/index.jsx', () => ({
    unsetError: jest.fn(),
    clearApiStatus: jest.fn()
}));

import actions from '../../contexts/actions/index.jsx';

describe('Error component', () => {

    const MOCK_DISPATCH = jest.fn();
    const MOCK_MATCH = { url: '/' };

    const DEFAULT_PROPS = {
        dispatch: MOCK_DISPATCH,
        match: MOCK_MATCH
    };

    beforeEach(() => {
        MOCK_DISPATCH.mockReset();
        MOCK_DISPATCH.mockReturnValue(Promise.resolve());
    });

    it('should render with default props', () => {
        const OUTER = shallow(<WrappedPage />);
        const Page = OUTER.props().children;
        const WRAPPER = render(
            <Page {...DEFAULT_PROPS}>
                <div>TEST</div>
            </Page>
        );
        expect(WRAPPER).toMatchSnapshot();
    });

    it('should render the error page when error passed in props', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            error: {}
        };
        const OUTER = shallow(<WrappedPage />);
        const Page = OUTER.props().children;
        const WRAPPER = render(
            <Page {...PROPS}>
                <div>TEST</div>
            </Page>
        );

        expect(WRAPPER).toMatchSnapshot();
    });

    it('should dispatch event to clear the error from the application context when unmounted', () => {
        const OUTER = shallow(<WrappedPage />);
        const Page = OUTER.props().children;
        const WRAPPER = shallow(
            <Page {...DEFAULT_PROPS}>
                <div>TEST</div>
            </Page>
        );

        WRAPPER.unmount();
        expect(MOCK_DISPATCH).not.toHaveBeenCalled();
        expect(actions.unsetError).not.toHaveBeenCalled();
    });

    it('should dispatch event to clear the error from the application context when unmounted', () => {
        const PROPS = {
            ...DEFAULT_PROPS,
            error: {}
        };
        const OUTER = shallow(<WrappedPage match={{ url: '/' }} />);
        const Page = OUTER.props().children;
        const WRAPPER = mount(
            <Page {...PROPS}>
                <div>TEST</div>
            </Page>
        );

        WRAPPER.unmount();
        expect(MOCK_DISPATCH).toHaveBeenCalled();
        expect(actions.unsetError).toHaveBeenCalled();
    });
});