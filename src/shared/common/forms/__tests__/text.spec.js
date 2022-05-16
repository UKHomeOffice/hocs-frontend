import React from 'react';
import Text from '../text.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Form text component', () => {
    test('should render with default props', () => {
        const wrapper = render(<Text name="text-field" updateState={() => null} />);
        expect(wrapper).toBeDefined();
    });

    test('should render with value when passed', () => {
        const wrapper = render(<Text name="text-field" value="field value" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByRole('textbox')).toHaveValue('field value');
    });

    test('should render with label when passed', () => {
        const wrapper = render(<Text name="text-field" label="My text field" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('My text field')).toBeInTheDocument();
    });

    test('should render with hint when passed', () => {
        const wrapper = render(<Text name="text-field" hint="Put some text in the box below" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Put some text in the box below')).toBeInTheDocument();
    });

    test('should render with error when passed', () => {
        const wrapper = render(<Text name="text-field" error="Some error message" updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    test('should render disabled when passed', () => {
        const wrapper = render(<Text name="text-field" disabled={true} updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByRole('textbox')).toHaveAttribute('disabled');
    });

    test('should render of type when passed', () => {
        const wrapper = render(<Text name="text-field" type="password" updateState={() => null} label="password" />);
        expect(wrapper).toBeDefined();
        expect(screen.getByLabelText('password')).toHaveAttribute('type');
    });

    test('should render limit when passed', () => {
        const wrapper = render(<Text name="text-field" disabled={true} updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByRole('textbox')).toHaveAttribute('maxLength');
    });

    test('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const fieldName = 'text-field';
        const wrapper = render(<Text name={fieldName} updateState={mockCallback} />);
        expect(wrapper).toBeDefined();
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [fieldName]: '' });
    });

    test('should execute callback on change', () => {
        const event = { target: { value: 'Text value' } };
        const mockCallback = jest.fn();
        const fieldName = 'text-field';
        const wrapper = render(<Text name={fieldName} updateState={mockCallback} />);
        expect(wrapper).toBeDefined();
        mockCallback.mockReset();
        fireEvent.change(wrapper.getByRole('textbox'),  event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [fieldName]: 'Text value' });
    });
});

