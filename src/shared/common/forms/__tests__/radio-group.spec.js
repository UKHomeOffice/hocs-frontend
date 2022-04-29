import React from 'react';
import RadioGroup from '../radio-group.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' },
];

describe('Form radio group component', () => {
    it('should render with default props', () => {
        const wrapper = render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />);
        expect(wrapper).toBeDefined();
    });

    it('should render with value when passed', () => {
        render(<RadioGroup name="radio-group" choices={choices} value="A" updateState={() => null} />);
        expect(screen.getByText('isA')).toBeInTheDocument();
    });

    it('should render with label when passed', () => {
        render(<RadioGroup name="radio-group" choices={choices} label="My text field" updateState={() => null} />);
        expect(screen.getByText('My text field')).toBeInTheDocument();
    });

    it('should render with hint when passed', () => {
        render(<RadioGroup name="radio-group" choices={choices} hint="Put some text in the box below" updateState={() => null} />);
        expect(screen.getByText('Put some text in the box below')).toBeInTheDocument();
    });

    it('should render with error when passed', () => {
        render(<RadioGroup name="radio-group" choices={choices} error="Some error message" updateState={() => null} />);
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    it('should render disabled when passed', () => {
        render(<RadioGroup name="radio-group" choices={choices} disabled={true} updateState={() => null} />);
        expect(screen.getByRole('group')).toBeDisabled();
    });

    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        render(<RadioGroup name="radio-group" choices={choices} updateState={mockCallback} />);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'radio-group': undefined });
    });

    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        let firstValue = 'A';
        let secondValue = 'B';
        const wrapper = render(<RadioGroup name="radio-group" choices={choices} updateState={mockCallback} />);
        mockCallback.mockReset();

        fireEvent.click(wrapper.getAllByRole('radio')[0]);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'radio-group': firstValue });

        fireEvent.click(wrapper.getAllByRole('radio')[1]);
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({ 'radio-group': secondValue });
    });

    it('should show textarea if conditional content exists', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA', conditionalContent: { label: 'someLabel' } },
            { label: 'labelB', value: 'ValueB' },
            { label: 'labelC', value: 'ValueC' }
        ];
        render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />);
        expect(screen.getByText('someLabel')).toBeInTheDocument();
    });

    it('should render error message for textarea if correct error exists in errors object', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA', conditionalContent: { label: 'someLabel' } },
            { label: 'labelB', value: 'ValueB' },
            { label: 'labelC', value: 'ValueC' }
        ];
        render(<RadioGroup name="radio-group" choices={choices} errors={{ ValueAText: 'Some error message' }} updateState={() => null} />);
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    it('should render if visible is set to true', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA' },
            { label: 'labelB', value: 'ValueB', visible: true },
            { label: 'labelC', value: 'ValueC', visible: 'true' },
        ];
        render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />);
        expect(screen.getAllByRole('radio')).toHaveLength(3);
    });
    it('should not render choices if visible is set to false', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA' },
            { label: 'labelB', value: 'ValueB', visible: false },
            { label: 'labelC', value: 'ValueC', visible: 'false' },
        ];
        render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />);
        expect(screen.getAllByRole('radio')).toHaveLength(1);
    });
});
