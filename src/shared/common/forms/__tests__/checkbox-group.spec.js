import React from 'react';
import CheckboxGroup from '../checkbox-group.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' }
];

const choicesWithName = [
    { label: 'isA', value: 'A', name: 'nameA' },
    { label: 'isB', value: 'B', name: 'nameB' },
    { label: 'isC', value: 'C', name: 'nameC' }
];

describe('Form checkbox group component', () => {
    it('should render with default props', () => {
        const wrapper = render(<CheckboxGroup name="checkbox-group" choices={choices} updateState={() => null} />);
        expect(wrapper).toBeDefined();
    });

    it('should render with value when passed', () => {
        render(<CheckboxGroup name="checkbox-group" choices={choices} value={'A'} updateState={() => null} />);
        expect(screen.getByText('isA')).toBeInTheDocument();
    });

    it('should render with label when passed', () => {
        render(<CheckboxGroup name="checkbox-group" choices={choices} label="My text field" showLabel={true} updateState={() => null} />);
        expect(screen.getByText('My text field')).toBeInTheDocument();
    });

    it('should render with hint when passed', () => {
        render(<CheckboxGroup name="checkbox-group" choices={choices} hint="Put some text in the box below" updateState={() => null} />);
        expect(screen.getByText('Put some text in the box below')).toBeInTheDocument();
    });

    it('should render with error when passed', () => {
        render(<CheckboxGroup name="checkbox-group" choices={choices} error="Some error message" updateState={() => null} />);
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    it('should render disabled when passed', () => {
        render(<CheckboxGroup name="checkbox-group" choices={choices} disabled={true} updateState={() => null} />);
        expect(screen.getByRole('group')).toBeDisabled();
    });

    it('should render separate values when showSeparately set', () => {
        render(<CheckboxGroup name="checkbox-group" choices={choicesWithName} disabled={true} updateState={() => null} saveSeparately={true} data={{}}/>);
        expect(screen.getByLabelText('isA').name).toBe('nameA');
        expect(screen.getByLabelText('isB').name).toBe('nameB');
        expect(screen.getByLabelText('isC').name).toBe('nameC');
    });

    it('should check the correct values when showSeparately set', () => {
        const data = {
            nameA: '',
            nameB: 'B',
            nameC: '',
        };
        render(<CheckboxGroup name="checkbox-group"
            choices={choicesWithName}
            disabled={true}
            updateState={() => null}
            saveSeparately={true}
            data={data}
        />);
        expect(screen.getByLabelText('isA').checked).toBe(false);
        expect(screen.getByLabelText('isB').checked).toBe(true);
        expect(screen.getByLabelText('isC').checked).toBe(false);
    });

    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        render(<CheckboxGroup name="checkbox-group" choices={choices} updateState={mockCallback} />);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': '' });
    });

    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const wrapper = render(<CheckboxGroup name="checkbox-group" choices={choices} updateState={mockCallback} />);
        mockCallback.mockReset();

        fireEvent.click(wrapper.getAllByRole('checkbox')[0]);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': 'A' });

        fireEvent.click(wrapper.getAllByRole('checkbox')[1]);
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': 'A,B' });

        fireEvent.click(wrapper.getAllByRole('checkbox')[2]);
        expect(mockCallback).toHaveBeenCalledTimes(3);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': 'A,B,C' });
    });
});

