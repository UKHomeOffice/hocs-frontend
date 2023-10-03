import React from 'react';
import Dropdown from '../dropdown.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' }
];

// update to add active flags
const conditionChoices = [
    {
        'conditionPropertyName': 'conditionValue',
        'conditionPropertyValue': 'a',
        'choices': [
            { 'label': 'isA', 'value': 'A' },
            { 'label': 'isB', 'value': 'B', 'active': true },
            { 'label': 'isC', 'value': 'C', 'active': false },
            { 'label': 'isD', 'value': 'D', 'active': false }
        ]
    },
    {
        'conditionPropertyName': 'conditionValue',
        'conditionPropertyValue': 'b',
        'choices': [
            { 'label': 'isA', 'value': 'A' },
            { 'label': 'isB', 'value': 'B', 'active': true },
            { 'label': 'isC', 'value': 'C', 'active': false }
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

    test('should render only active options (one inactive dropdown value), default is active', () => {
        const wrapper = render(<Dropdown name="radio-group" conditionChoices={conditionChoices}
            data={{ 'conditionValue': 'b' }} updateState={() => null} />);

        expect(wrapper).toBeDefined();

        expect(screen.getByText('isA')).toBeInTheDocument();
        expect(screen.getByText('isB')).toBeInTheDocument();
        expect(screen.queryByText('isC')).not.toBeInTheDocument();
    });

    test('should render only active options and dont fetch inactive ones (multiple dropdown values), default is active', () => {
        const wrapper = render(<Dropdown name="radio-group" conditionChoices={conditionChoices}
            data={{ 'conditionValue': 'a' }} updateState={() => null} />);

        expect(wrapper).toBeDefined();

        expect(screen.getByText('isA')).toBeInTheDocument();
        expect(screen.getByText('isB')).toBeInTheDocument();
        expect(screen.queryByText('isC')).not.toBeInTheDocument();
        expect(screen.queryByText('isD')).not.toBeInTheDocument();
    });

});
