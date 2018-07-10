import React from 'react';
import Date from '../date.jsx';

describe('Form date component', () => {
    it('should render with default props', () => {
        expect(
            render(<Date name="date-field" />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<Date name="date-field" value="2018-01-19" />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<Date name="date-field" label="My text field" />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<Date name="date-field" hint="Put some text in the box below" />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<Date name="date-field" error="Some error message" />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<Date name="date-field" disabled={true} />)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        shallow(
            <Date name="date" updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date-day': '', 'date-month': '', 'date-year': '' });
    });
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <Date name="date" updateState={mockCallback} />
        );

        let event = { target: { value: '19' } };
        mockCallback.mockReset();
        wrapper.find('#date-day').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date-day': '19' });

        mockCallback.mockReset();
        event = { target: { value: '01' } };
        wrapper.find('#date-month').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date-month': '01' });

        mockCallback.mockReset();
        event = { target: { value: '2018' } };
        wrapper.find('#date-year').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'date-year': '2018' });
    });
});

