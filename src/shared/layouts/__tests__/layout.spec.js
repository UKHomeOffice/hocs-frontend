import React from 'react';
import Layout from '../layout.jsx';

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

});