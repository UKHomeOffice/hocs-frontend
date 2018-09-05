import React from 'react';
import Main from '../main.jsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../common/components/workstack.jsx', () => (
    'MOCK_WORKSTACK'
));

describe('Main page component', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('MainPage')).toMatchSnapshot();
    });

    it('should render with caption when passed in props', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Main caption='MY CAPTION' />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('MainPage')).toMatchSnapshot();
    });

});