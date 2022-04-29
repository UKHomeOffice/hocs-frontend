import React from 'react';
import CaseNote from '../case-note.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('When the component is rendered', () => {
    const mockDispatch = jest.fn();
    const useContextSpy = jest.spyOn(React, 'useContext').mockImplementation(() => ({
        dispatch: mockDispatch,
        page: {
            params: {
                caseId: '__caseId__'
            }
        },
        track: jest.fn(),
        hasRole: jest.fn().mockReturnValue(true)
    }));

    test('Expected elements are in the displayed component', () => {
        const props = {
            author: '__author__',
            date: '__date__',
            modifiedBy: '__modifiedBy__',
            modifiedDate: '__modifiedDate__',
            note: '__note__',
            timelineItemUUID: '__timelineItemUUID__',
            title: '__title__'
        };

        const wrapper = render(<CaseNote {...props} />);
        expect(wrapper).toBeDefined();
        expect(useContextSpy).toHaveBeenCalled();

        expect(screen.getByText('__author__')).toBeInTheDocument();
        expect(screen.getByText('__date__')).toBeInTheDocument();
        expect(screen.getByText('__note__')).toBeInTheDocument();
        expect(screen.getByText('Edited on __modifiedDate__ - __modifiedBy__')).toBeInTheDocument();
        expect(screen.getByText('__title__' +
            '.')).toBeInTheDocument();
    });
});
