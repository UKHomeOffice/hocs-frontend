import React from 'react';
import DateInput from '../date.jsx';

const maxYear = 2119;

describe('Form date component', () => {
    it('should render with default props', () => {
        expect(
            render(<DateInput name="date-field" maxYear={maxYear} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<DateInput name="date-field" maxYear={maxYear} value="2018-01-19" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<DateInput name="date-field" maxYear={maxYear} label="My text field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<DateInput name="date-field" maxYear={maxYear} hint="Put some text in the box below" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<DateInput name="date-field" maxYear={maxYear} error="Some error message" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<DateInput name="date-field" maxYear={maxYear} disabled={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <DateInput name="date" updateState={mockCallback} />
        );

        let event = { target: { value: '19' } };
        mockCallback.mockReset();
        wrapper.find('#date-day').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date': '--19' });

        mockCallback.mockReset();
        event = { target: { value: '01' } };
        wrapper.find('#date-month').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date': '-01-' });

        mockCallback.mockReset();
        event = { target: { value: '2018' } };
        wrapper.find('#date-year').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date': '2018--' });
    });
});

