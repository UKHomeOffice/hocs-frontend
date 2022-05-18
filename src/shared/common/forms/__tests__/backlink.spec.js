import React from 'react';
import Backlink from '../backlink';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Form backlink component', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrapper = render(
            <Backlink action="/SOME/URL" />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
    });

    it('should render disabled when isDisabled is passed', () => {
        render(
            <Backlink action="/SOME/URL" disabled={true} />,
            { wrapper: MemoryRouter }
        );
        expect(screen.getByRole('link')).toHaveAttribute('disabled');
    });

    it('should render with correct label when passed', () => {
        render(
            <Backlink label='MY_LABEL' action="/SOME/URL" />,
            { wrapper: MemoryRouter }
        );
        expect(screen.getByText('MY_LABEL')).toBeInTheDocument();
    });
});
