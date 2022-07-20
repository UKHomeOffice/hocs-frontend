import React from 'react';
import { BackButton } from '../back-button.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Form back button component', () => {

    const mockDispatch = jest.fn(() => Promise.resolve().catch((error) => logger.error(error)));
    const mockHistory = {};

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrappedButton = render(
            <BackButton action="/SOME/URL" dispatch={mockDispatch}
                history={mockHistory} caseId='caseId123' stageId='stageId123' />,
            { wrapper: MemoryRouter }
        );
        expect(wrappedButton).toBeDefined();
    });

    it('should render disabled when isDisabled is passed', () => {
        render(
            <BackButton action="/SOME/URL" disabled={true} dispatch={mockDispatch}
                history={mockHistory} caseId='caseId123' stageId='stageId123' />,
            { wrapper: MemoryRouter }
        );

        expect(screen.getByRole('link')).toHaveAttribute('disabled');
    });

    it('should render with correct label when passed', () => {
        render(
            <BackButton label={'My Button'} action="/SOME/URL" dispatch={mockDispatch}
                history={mockHistory} caseId='caseId123' stageId='stageId123' />,
            { wrapper: MemoryRouter }
        );
        expect(screen.getByText('My Button')).toBeInTheDocument();
    });
});
