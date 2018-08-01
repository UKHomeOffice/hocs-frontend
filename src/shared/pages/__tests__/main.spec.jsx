import React from 'react';
import Main from '../main.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Main page component', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const outer = shallow(<Main />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('MainPage')).toMatchSnapshot();
    });

    it('should render with caption when passed in props', () => {
        const outer = shallow(<Main caption='MY_CAPTION' />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('MainPage')).toMatchSnapshot();
    });

});