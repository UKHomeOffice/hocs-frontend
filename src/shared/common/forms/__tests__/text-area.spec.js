import React from 'react';
import TextArea from '../text-area';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Form text area component', () => {
    test('should render with default props', () => {
        const wrapper = render(<TextArea name="text-field" updateState={() => null} />);
        expect(wrapper).toBeDefined();
    });

    test('should render with value when passed', () => {
        const wrapper = render(<TextArea name="text-field" value="field value" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('field value')).toBeInTheDocument();
    });

    test('should render with label when passed', () => {
        const wrapper = render(<TextArea name="text-field" label="My text field" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('My text field')).toBeInTheDocument();
    });

    test('should render with hint when passed', () => {
        const wrapper = render(<TextArea name="text-field" hint="Put some text in the box below" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Put some text in the box below')).toBeInTheDocument();
    });

    test('should render with error when passed', () => {
        const wrapper = render(<TextArea name="text-field" error="Some error message" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    test('should render disabled when passed', () => {
        const wrapper = render(<TextArea name="text-field" disabled={true} updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    test('should render limit when passed', () => {
        const value = 'this string is more than 20 characters long';
        const wrapper = render(<TextArea name="text-field" limit={20} updateState={() => null} value={value} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('You have -23 characters remaining')).toBeInTheDocument();
    });

    test('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const fieldName = 'text-field';
        const wrapper = render(<TextArea name={fieldName} updateState={mockCallback} />);
        expect(wrapper).toBeDefined();
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [fieldName]: '' });
    });

    test('should execute callback on change', () => {
        const event = { target: { value: 'TextArea value' } };
        const mockCallback = jest.fn();
        const fieldName = 'text-field';
        const wrapper = render(<TextArea name={fieldName} updateState={mockCallback} />);
        expect(wrapper).toBeDefined();

        mockCallback.mockReset();
        fireEvent.change(wrapper.getByRole('textbox'),  event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [fieldName]: 'TextArea value' });
    });
});

