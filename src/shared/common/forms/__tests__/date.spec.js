import React from 'react';
import DateInput from '../date.jsx';
import { advanceTo, clear } from 'jest-date-mock';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const maxYear = 2119;

describe('Form date component', () => {
    beforeAll(() => {
        advanceTo(new Date(2019, 2, 4, 0, 0, 0));
    });

    afterAll(() => {
        clear();
    });

    test('should render with default props', () => {
        const wrapper = render(
            <DateInput updateState={() => null} name={'Date input'} />
        );
        expect(wrapper).toBeDefined();
    });

    test('should render with value when passed', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} value="2018-01-19" updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getAllByRole('textbox')[0]).toHaveValue('19');
        expect(screen.getAllByRole('textbox')[1]).toHaveValue('01');
        expect(screen.getAllByRole('textbox')[2]).toHaveValue('2018');
    });

    test('should render when maxYear is passed', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} value="2018-01-19" updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getAllByRole('textbox')[2]).toHaveAttribute('max');
    });

    test('should render with label when passed', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} label="My text field" updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('My text field')).toBeInTheDocument();
    });

    test('should render with hint when passed', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} hint="Put some text in the box below" updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Put some text in the box below')).toBeInTheDocument();
    });

    test('should render with error when passed', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} error="Some error message" updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Some error message')).toBeInTheDocument();
    });

    test('should render disabled when passed', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} disabled={true} updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByRole('group')).toHaveAttribute('disabled');
    });

    test('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const wrapper = render(
            <DateInput name="date" updateState={mockCallback} />
        );

        let event = { target: { value: '19 ' } };
        mockCallback.mockReset();
        fireEvent.change(wrapper.getAllByRole('textbox')[0],  event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date': '--19' });

        mockCallback.mockReset();
        event = { target: { value: ' 01' } };
        fireEvent.change(wrapper.getAllByRole('textbox')[1],  event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date': '-01-' });

        mockCallback.mockReset();
        event = { target: { value: ' 2018 ' } };
        fireEvent.change(wrapper.getAllByRole('textbox')[2],  event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date': '2018--' });
    });

    test('should populate date field with todays date when asked to', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} autopopulate={true} updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getAllByRole('textbox')[0]).toHaveValue('04');
        expect(screen.getAllByRole('textbox')[1]).toHaveValue('03');
        expect(screen.getAllByRole('textbox')[2]).toHaveValue('2019');
    });

    test('should not populate date field with todays date when not asked to', () => {
        const wrapper = render(
            <DateInput name="date-field" maxYear={maxYear} autopopulate={false} updateState={() => null} />
        );
        expect(wrapper).toBeDefined();
        expect(screen.getAllByRole('textbox')[0]).not.toHaveValue('04');
        expect(screen.getAllByRole('textbox')[1]).not.toHaveValue('03');
        expect(screen.getAllByRole('textbox')[2]).not.toHaveValue('2019');
    });

});
