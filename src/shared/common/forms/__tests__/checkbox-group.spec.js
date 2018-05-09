import React from 'react';
import CheckboxGroup from '../checkbox-group.jsx';

const choices = [
    {label: 'isA', value: 'A'},
    {label: 'isB', value: 'B'},
    {label: 'isC', value: 'C'}
];

describe('Form checkbox group component', () => {
    it('should render with default props', () => {
        expect(
            render(<CheckboxGroup name="checkbox-group" choices={choices}/>)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<CheckboxGroup name="checkbox-group" choices={choices} value="isA"/>)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<CheckboxGroup name="checkbox-group" choices={choices} label="My text field"/>)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<CheckboxGroup name="checkbox-group" choices={choices} hint="Put some text in the box below"/>)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<CheckboxGroup name="checkbox-group" choices={choices} error="Some error message"/>)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<CheckboxGroup name="checkbox-group" choices={choices} disabled={true}/>)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <CheckboxGroup name="checkbox-group" choices={choices} updateState={mockCallback}/>
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({'checkbox-group': []});
    });
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const firstValue = 'A';
        const secondValue = 'B';
        const wrapper = shallow(
            <CheckboxGroup name="checkbox-group" choices={choices} updateState={mockCallback}/>
        );
        mockCallback.mockReset();

        wrapper.find(`#checkbox-group-${firstValue}`).simulate('change', {target: {value: firstValue}});
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({'checkbox-group': [firstValue]});

        wrapper.find(`#checkbox-group-${secondValue}`).simulate('change', {target: {value: secondValue}});
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({'checkbox-group': [firstValue, secondValue]});

        wrapper.find(`#checkbox-group-${firstValue}`).simulate('change', {target: {value: firstValue}});
        expect(mockCallback).toHaveBeenCalledTimes(3);
        expect(mockCallback).toHaveBeenCalledWith({'checkbox-group': [secondValue]});
    });
});

