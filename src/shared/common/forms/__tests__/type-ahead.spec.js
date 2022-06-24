import React from 'react';
import TypeAhead from '../type-ahead.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const choices = [
    {
        label: 'Parent 1',
        options: [
            { label: 'Child 1', value: 'PARENT_1_CHILD_1' },
            { label: 'Child 2', value: 'PARENT_1_CHILD_2' },
        ]
    }
];

describe('Form type ahead component (dropdown)', () => {
    it('should render with default props', () => {
        const wrapper = render(<TypeAhead name='type-ahead' updateState={() => null} />);
        expect(wrapper).toBeDefined();
    });

    it('should render with label when passed', () => {
        render(<TypeAhead
            name='type-ahead'
            updateState={() => null}
            label='Type-ahead'
        />);
        expect(screen.getByText('Type-ahead')).toBeInTheDocument();
    });

    it('should render with hint when passed', () => {
        render(<TypeAhead
            name='type-ahead'
            updateState={() => null}
            hint='Select an option'
        />);
        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render with error when passed', () => {
        render(<TypeAhead
            name='type-ahead'
            updateState={() => null}
            error='Some error message'
        />);
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    it('should render disabled when passed', () => {
        render(<TypeAhead
            name='type-ahead'
            updateState={() => null}
            disabled={true}
        />);
        expect(screen.getByRole('combobox', { hidden: true })).toBeDisabled();
    });

});

describe('Form type ahead component (select)', () => {
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        render(<TypeAhead name='type-ahead' choices={choices} updateState={mockCallback} />);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': undefined });
    });
});
