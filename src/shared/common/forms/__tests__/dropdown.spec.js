import React from 'react';
import Dropdown from '../dropdown.jsx';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' }
];

describe('Form dropdown component', () => {
    it('should render with default props', () => {
        expect(
            render(<Dropdown name="radio-group" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<Dropdown name="radio-group" choices={choices} value="A" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<Dropdown name="radio-group" choices={choices} label="My text field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<Dropdown name="radio-group" choices={choices} hint="Put some text in the box below" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<Dropdown name="radio-group" choices={choices} error="Some error message" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<Dropdown name="radio-group" choices={choices} disabled={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        shallow(
            <Dropdown name="dropdown" choices={choices} updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': undefined });
    });
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        let firstValue = 'A';
        let secondValue = 'B';
        const wrapper = shallow(
            <Dropdown name="dropdown" choices={choices} updateState={mockCallback} />
        );

        mockCallback.mockReset();

        wrapper.find('#dropdown').simulate('change', { target: { value: firstValue } });
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': firstValue });

        wrapper.find('#dropdown').simulate('change', { target: { value: secondValue } });
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': secondValue });
    });
});

