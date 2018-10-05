import React from 'react';
import Main from '../main.jsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../common/components/workstack.jsx', () => (
    'div'
));

describe('Main page component', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('MainPage')).toMatchSnapshot();
    });

    it('should render with caption when passed in props', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <Main caption='MY CAPTION' />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('MainPage')).toMatchSnapshot();
    });

});