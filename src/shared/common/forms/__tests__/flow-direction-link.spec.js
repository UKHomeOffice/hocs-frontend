import React from 'react';
import { FlowDirectionLink } from '../flow-direction-link.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Form Flow Direction Link component', () => {

    const mockDispatch = jest.fn(() => Promise.resolve());
    const mockHistory = {};

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrappedButton = render(
            <FlowDirectionLink action="/SOME/URL" dispatch={mockDispatch}
                history={mockHistory} caseId='caseId123' stageId='stageId123' flowDirection='back' />,
            { wrapper: MemoryRouter }
        );
        expect(wrappedButton).toBeDefined();
    });

    it('should render disabled when isDisabled is passed', () => {
        render(
            <FlowDirectionLink action="/SOME/URL" dispatch={mockDispatch}
                history={mockHistory} caseId='caseId123' stageId='stageId123' flowDirection='back' disabled={true} />,
            { wrapper: MemoryRouter }
        );
        expect(screen.getByRole('link')).toHaveAttribute('disabled');
    });

    it('should render with correct label when passed', () => {
        render(
            <FlowDirectionLink label={'My Button'} action="/SOME/URL" dispatch={mockDispatch}
                history={mockHistory} caseId='caseId123' stageId='stageId123' flowDirection='back' />,
            { wrapper: MemoryRouter }
        );
        expect(screen.getByText('My Button')).toBeInTheDocument();
    });
});
