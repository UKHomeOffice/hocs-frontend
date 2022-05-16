import React from 'react';
import Button from '../button.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Form button component', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const outer = shallow(<Button action="/SOME/URL" />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Button')).toMatchSnapshot();
    });

    it('should render disabled when isDisabled is passed', () => {
        const outer = shallow(<Button disabled={true} action="/SOME/URL" />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Button')).toMatchSnapshot();
        expect(wrapper.find('Link').props().disabled).toEqual(true);
    });

    it('should render with correct label when passed', () => {
        const outer = shallow(<Button label={'My Button'} action="/SOME/URL" />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Button')).toMatchSnapshot();
        expect(wrapper.find('Link').props().children).toEqual('My Button');
    });

    it('should render with additional styles when className is passed', () => {
        const outer = shallow(<Button className={'test-class'} action="/SOME/URL" />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Button')).toMatchSnapshot();
        expect(wrapper.find('Link').props().className).toEqual('govuk-button test-class');
    });

    it('should dispatch action when clicked', () => {
        const outer = shallow(<Button action="/SOME/URL" />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        wrapper.find('Link').simulate('click');
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

});