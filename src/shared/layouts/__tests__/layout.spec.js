import React from 'react';
import Layout from '../layout.jsx';
import ActionTypes from '../../contexts/actions/types';

jest.mock('react-router-dom', () => {
    return {
        Redirect: () => jest.fn()
    };
});

describe('Page layout component', () => {

    const mockDispatch = jest.fn();
    const mockLayout = {
        header: {},
        body: {},
        footer: {}
    };

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should have the dispatch method in props from the context consumer', () => {
        const outer = shallow(<Layout />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} layout={mockLayout} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.props().dispatch).toBeDefined();
    });

    it('should render the footer when provided', () => {
        const mockLayoutWithFooter = { ...mockLayout, footer: { isVisible: true } };
        const outer = shallow(<Layout />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} layout={mockLayoutWithFooter} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Footer')).toHaveLength(1);
    });

    it('should render the error component over children when error is provided', () => {
        const mockError = {};
        const outer = shallow(<Layout />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} layout={mockLayout} error={mockError} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Error')).toHaveLength(1);
    });

    it('should dispatch a REDIRECTED event when redirected', () => {
        const mockRedirect = 'REDIRECTED';
        const outer = shallow(<Layout />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} layout={mockLayout} redirect={mockRedirect} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Layout').props().redirect).toBeDefined();
        expect(wrapper.find('Layout').props().redirect).toEqual('REDIRECTED');
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.REDIRECTED).length).toEqual(1);
    });

    it('should dispatch UNSET_FORM and UNSET_ERROR actions when unmounted on a browser back event', () => {
        const mockHistory = {
            action: 'POP'
        };
        const outer = shallow(<Layout history={mockHistory} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} layout={mockLayout} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Layout').props().history).toBeDefined();
        expect(wrapper.find('Layout').props().history.action).toEqual('POP');
        wrapper.unmount();
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.UNSET_FORM).length).toEqual(1);
        expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.UNSET_ERROR).length).toEqual(1);
    });

    it('should not dispatch UNSET_FORM and UNSET_ERROR actions when unmounted when not a browser back event', () => {
        const mockHistory = {
            action: 'PUSH'
        };
        const outer = shallow(<Layout history={mockHistory} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} layout={mockLayout} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Layout').props().history).toBeDefined();
        expect(wrapper.find('Layout').props().history.action).toEqual('PUSH');
        wrapper.unmount();
        expect(mockDispatch).toHaveBeenCalledTimes(0);
    });

});