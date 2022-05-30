import React from 'react';
import Action from '../action.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('../form-enabled.jsx', () => (
    (C) => C
));

describe('Action page component', () => {

    it('should render with default props', () => {
        const wrapper = render(<Action />);
        expect(wrapper).toBeDefined();
    });

    it('should render with title when passed in props', () => {
        const wrapper = render(<Action title='MY_TITLE' />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_TITLE')).toBeInTheDocument();
    });

    it('should render with subTitle when passed in props', () => {
        const wrapper = render(<Action title='MY_TITLE' subTitle='MY_SUBTITLE' />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_TITLE')).toBeInTheDocument();
        expect(screen.getByText('MY_SUBTITLE')).toBeInTheDocument();
    });

    it('should render children when passed', () => {
        const wrapper = render(
            <Action>
                FORM
            </Action>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('FORM')).toBeInTheDocument();
    });

});
