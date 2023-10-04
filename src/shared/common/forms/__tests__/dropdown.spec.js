import React from 'react';
import Dropdown from '../dropdown.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B', 'active': true },
    { label: 'isC', value: 'C', 'active': false }
];

// update to add active flags
const conditionChoices = [
    {
        'conditionPropertyName': 'conditionValue',
        'conditionPropertyValue': 'a',
        'choices': [
            { 'label': 'conditionA valueA', 'value': 'A' },
            { 'label': 'conditionA valueB', 'value': 'B', 'active': true },
            { 'label': 'conditionA valueC', 'value': 'C', 'active': false }
        ]
    },
    {
        'conditionPropertyName': 'conditionValue',
        'conditionPropertyValue': 'b',
        'choices': [
            { 'label': 'conditionB valueA', 'value': 'A' },
            { 'label': 'conditionB valueB', 'value': 'B', 'active': true },
            { 'label': 'conditionB valueC', 'value': 'C', 'active': false }
        ]
    },
];

describe('Form dropdown component', () => {
    test('should render with default props', () => {
        const wrapper = render(<Dropdown name="radio-group" updateState={() => null} />);
        expect(wrapper).toBeDefined();
    });

    test('should render with label when passed', () => {
        const wrapper = render(<Dropdown name="radio-group" choices={choices} label="My text field" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('My text field')).toBeInTheDocument();
    });

    test('should render with hint when passed', () => {
        const wrapper = render(<Dropdown name="radio-group" choices={choices} hint="Put some text in the box below" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Put some text in the box below')).toBeInTheDocument();
    });

    test('should render with error when passed', () => {
        const wrapper = render(<Dropdown name="radio-group" choices={choices} error="Some error message" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    test('should render disabled when passed', () => {
        const wrapper = render(<Dropdown name="radio-group" choices={choices} disabled={true} updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    test('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const wrapper = render(<Dropdown name="dropdown" choices={choices} updateState={mockCallback} />);
        expect(wrapper).toBeDefined();
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': undefined });
    });

    test('should execute callback on change', () => {
        const mockCallback = jest.fn();
        let firstValue = 'A';
        let secondValue = 'B';
        const wrapper = render(<Dropdown name="dropdown" choices={choices} updateState={mockCallback} />);


        mockCallback.mockReset();

        fireEvent.change(wrapper.getByRole('combobox'),  { target: { value: firstValue } });
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': firstValue });

        fireEvent.change(wrapper.getByRole('combobox'),  { target: { value: secondValue } });
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': secondValue });
    });

    test('should render only active options (exclie inactive dropdown value), default is active', () => {
        const wrapper = render(<Dropdown name="radio-group" conditionChoices={conditionChoices}
            data={{ 'conditionValue': 'a' }} updateState={() => null} />);

        expect(wrapper).toBeDefined();

        expect(screen.getByText('conditionA valueA')).toBeInTheDocument();
        expect(screen.queryByText('conditionA valueB')).toBeInTheDocument();
        expect(screen.queryByText('conditionA valueC')).not.toBeInTheDocument();
        expect(screen.queryByText('conditionB valueA')).not.toBeInTheDocument();

        wrapper.rerender(<Dropdown name="radio-group" conditionChoices={conditionChoices}
            data={{ 'conditionValue': 'b' }} updateState={() => null} />);

        expect(screen.getByText('conditionB valueA')).toBeInTheDocument();
        expect(screen.getByText('conditionB valueB')).toBeInTheDocument();
        expect(screen.queryByText('conditionB valueC')).not.toBeInTheDocument();
        expect(screen.queryByText('conditionA valueA')).not.toBeInTheDocument();

    });

    test('should render only active options, default is active', () => {
        const wrapper = render(<Dropdown name="radio-group" choices={choices} updateState={() => null} />);

        expect(wrapper).toBeDefined();

        expect(screen.queryByText('isA')).not.toBeNull(); // default is active
        expect(screen.queryByText('isB')).not.toBeNull(); // explicitly active
        expect(screen.queryByText('isC')).toBeNull(); // explicitly inactive
    });

});
