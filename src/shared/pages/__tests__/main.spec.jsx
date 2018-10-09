import React from 'react';
import Main from '../main.jsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../dashboard.jsx', () => () => 'MOCK_DASHBOARD');

describe('Main page component', () => {

    it('should render with default props', () => {
        const wrapper = render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('MainPage')).toMatchSnapshot();
    });

});